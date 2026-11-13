// Generated from the files in public/ — intrinsic width / height for each
// collage image.
//
// The collage fit needs to know how much of its cell an image actually paints:
// with object-fit: contain an image is letterboxed inside its cell, so sizing
// it by the cell alone overstates its width and pushes the canvas wider (and
// therefore the whole page smaller) than necessary. Measuring at runtime is not
// an option because the images load lazily, which would make the layout jump
// as the visitor scrolls.
//
// Regenerate if the images change; an image missing here just falls back to its
// full cell, which is a safe over-estimate.
export const IMAGE_ASPECTS: Record<string, number> = {
  "/1.PNG": 1.4388,
  "/2.PNG": 1.4388,
  "/3.png": 0.6967,
  "/4.png": 0.683,
  "/antecollage.png": 1.4142,
  "/axo berg.jpg": 0.7071,
  "/back berg.jpg": 1.7778,
  "/backrrender.png": 1.7778,
  "/bamboo.jpg": 0.7292,
  "/bamboo2.jpg": 1.2019,
  "/bergsketch.jpg": 0.4744,
  "/bigsiteptf.png": 1.133,
  "/culv1.jpg": 0.644,
  "/culv2.jpg": 0.8259,
  "/diaomah.jpg": 0.3904,
  "/diaptf.jpg": 4.968,
  "/exhi.png": 1.442,
  "/filletberg.jpg": 1.7778,
  "/harberg.jpg": 1.7778,
  "/highlevel.png": 1.4605,
  "/joelle_warsono_portfolio_Page_13.jpg": 0.5256,
  "/joelleprofile.jpg": 0.7233,
  "/joelleprofile2.jpg": 0.8114,
  "/kingsarms.png": 0.7391,
  "/kingsarms2.png": 0.75,
  "/kingsarms3.png": 0.75,
  "/mainante.png": 1.7778,
  "/model.png": 0.85,
  "/officenew.png": 1.7616,
  "/omah1.gif": 1.7778,
  "/omah3.gif?v=2": 1.7778,
  "/omah_plan.png": 1.4414,
  "/omah_ver1.png": 1.5918,
  "/omah_ver2.png": 1.9171,
  "/omah_weave1.png": 1.447,
  "/omah_weave2.PNG": 0.7292,
  "/ptfgf.png": 1.414,
  "/ptfmodel.PNG": 1.8444,
  "/roofrender.png": 1.5093,
  "/siteplanberg2.jpg": 1.3836,
  "/sketchcompilation2.png": 0.5148,
  "/stone1.png": 1.5,
  "/stone2.png": 0.6667,
  "/stone3.png": 1.5,
  "/stone4.png": 0.6667,
  "/technical.jpg": 1.1978,
  "/undergif.gif": 1.7778,
  "/vern3.png": 1.2266
};
