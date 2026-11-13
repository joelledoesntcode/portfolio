# One-off helper: extract the flattened composite from a PSD and save it as JPG,
# so a Photoshop source in public/ can be used on the page. No external tools.
param(
  [Parameter(Mandatory = $true)][string]$Source,
  [Parameter(Mandatory = $true)][string]$Dest,
  [int]$MaxDim = 2400,
  [long]$Quality = 88
)

Add-Type -AssemblyName System.Drawing

$code = @'
using System;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Runtime.InteropServices;

public static class PsdFlatten
{
    static void ReadFull(Stream s, byte[] buf, int count)
    {
        int off = 0;
        while (off < count)
        {
            int n = s.Read(buf, off, count - off);
            if (n <= 0) throw new Exception("unexpected end of file");
            off += n;
        }
    }

    static uint BE32(Stream s)
    {
        byte[] b = new byte[4];
        ReadFull(s, b, 4);
        return ((uint)b[0] << 24) | ((uint)b[1] << 16) | ((uint)b[2] << 8) | b[3];
    }

    static int BE16(Stream s)
    {
        byte[] b = new byte[2];
        ReadFull(s, b, 2);
        return (b[0] << 8) | b[1];
    }

    // PackBits decode of one scanline into plane[offset .. offset+width).
    static void Unpack(byte[] src, byte[] plane, int offset, int width)
    {
        int i = 0, o = offset, end = offset + width;
        while (i < src.Length && o < end)
        {
            sbyte n = unchecked((sbyte)src[i++]);
            if (n >= 0)
            {
                int count = n + 1;
                for (int k = 0; k < count && o < end; k++) plane[o++] = src[i++];
            }
            else if (n != -128)
            {
                int count = 1 - n;
                byte v = src[i++];
                for (int k = 0; k < count && o < end; k++) plane[o++] = v;
            }
        }
    }

    public static string Convert(string src, string dst, int maxDim, long quality)
    {
        int width, height, channels;
        byte[][] planes = new byte[3][];

        using (FileStream fs = File.OpenRead(src))
        {
            byte[] h = new byte[26];
            ReadFull(fs, h, 26);
            if (h[0] != '8' || h[1] != 'B' || h[2] != 'P' || h[3] != 'S') throw new Exception("not a PSD");
            channels = (h[12] << 8) | h[13];
            height = (int)(((uint)h[14] << 24) | ((uint)h[15] << 16) | ((uint)h[16] << 8) | h[17]);
            width = (int)(((uint)h[18] << 24) | ((uint)h[19] << 16) | ((uint)h[20] << 8) | h[21]);
            int depth = (h[22] << 8) | h[23];
            int colorMode = (h[24] << 8) | h[25];
            if (depth != 8) throw new Exception("only 8-bit PSDs supported, got " + depth);
            if (colorMode != 3 && colorMode != 1) throw new Exception("only RGB/grayscale supported, mode " + colorMode);

            // Skip the three length-prefixed sections. Read the length into a
            // local first: "fs.Position += BE32(fs)" would reuse the position
            // captured *before* the 4-byte read and land short every time.
            uint skip;
            skip = BE32(fs); fs.Position = fs.Position + skip;   // colour mode data
            skip = BE32(fs); fs.Position = fs.Position + skip;   // image resources
            skip = BE32(fs); fs.Position = fs.Position + skip;   // layer & mask info
            int compression = BE16(fs);           // 0 = raw, 1 = RLE

            int planeLen = width * height;
            int keep = Math.Min(channels, 3);

            if (compression == 0)
            {
                for (int c = 0; c < channels; c++)
                {
                    byte[] plane = new byte[planeLen];
                    ReadFull(fs, plane, planeLen);
                    if (c < keep) planes[c] = plane;
                }
            }
            else if (compression == 1)
            {
                int[] counts = new int[height * channels];
                for (int i = 0; i < counts.Length; i++) counts[i] = BE16(fs);
                int idx = 0;
                for (int c = 0; c < channels; c++)
                {
                    byte[] plane = c < keep ? new byte[planeLen] : null;
                    for (int y = 0; y < height; y++)
                    {
                        int n = counts[idx++];
                        byte[] row = new byte[n];
                        ReadFull(fs, row, n);
                        if (plane != null) Unpack(row, plane, y * width, width);
                    }
                    if (c < keep) planes[c] = plane;
                }
            }
            else throw new Exception("unsupported compression " + compression);
        }

        // Grayscale: reuse the single plane for all three channels.
        if (planes[1] == null) planes[1] = planes[0];
        if (planes[2] == null) planes[2] = planes[0];

        using (Bitmap bmp = new Bitmap(width, height, PixelFormat.Format24bppRgb))
        {
            BitmapData bd = bmp.LockBits(new Rectangle(0, 0, width, height), ImageLockMode.WriteOnly, PixelFormat.Format24bppRgb);
            byte[] line = new byte[bd.Stride];
            for (int y = 0; y < height; y++)
            {
                int rowStart = y * width;
                for (int x = 0; x < width; x++)
                {
                    int o = x * 3;
                    line[o] = planes[2][rowStart + x];      // B
                    line[o + 1] = planes[1][rowStart + x];  // G
                    line[o + 2] = planes[0][rowStart + x];  // R
                }
                Marshal.Copy(line, 0, new IntPtr(bd.Scan0.ToInt64() + (long)y * bd.Stride), bd.Stride);
            }
            bmp.UnlockBits(bd);

            Image outImg = bmp;
            Bitmap scaled = null;
            int longest = Math.Max(width, height);
            if (maxDim > 0 && longest > maxDim)
            {
                double f = (double)maxDim / longest;
                int w2 = Math.Max(1, (int)Math.Round(width * f));
                int h2 = Math.Max(1, (int)Math.Round(height * f));
                scaled = new Bitmap(w2, h2, PixelFormat.Format24bppRgb);
                using (Graphics g = Graphics.FromImage(scaled))
                {
                    g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                    g.DrawImage(bmp, 0, 0, w2, h2);
                }
                outImg = scaled;
            }

            ImageCodecInfo jpeg = null;
            foreach (ImageCodecInfo c in ImageCodecInfo.GetImageEncoders())
                if (c.MimeType == "image/jpeg") jpeg = c;
            EncoderParameters ep = new EncoderParameters(1);
            ep.Param[0] = new EncoderParameter(Encoder.Quality, quality);
            outImg.Save(dst, jpeg, ep);
            string res = outImg.Width + "x" + outImg.Height + " (source " + width + "x" + height + ")";
            if (scaled != null) scaled.Dispose();
            return res;
        }
    }
}
'@

Add-Type -TypeDefinition $code -ReferencedAssemblies System.Drawing
[PsdFlatten]::Convert($Source, $Dest, $MaxDim, $Quality)
