require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const logger = require("morgan");
const uaParser = require("ua-parser-js");

const app = express();
const errorHandler = require("errorhandler");
const path = require("path");
const port = 3000;

const Prismic = require("@prismicio/client");
const PrismicDOM = require("@prismicio/helpers");

app.use(express.static(path.join(__dirname, "public")));
const initApi = (req) => {
  return Prismic.createClient(process.env.PRISMIC_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
    req,
    fetch,
  });
};


const handleRequest = async (api) => {
  const meta = await api.getSingle("meta");
  const preloader = await api.getSingle("preloader");

  const collections= await fetchCollections(api);
  const home = await api.getSingle("home");
  const about = await api.getSingle("about");

  let assets =[]

  home.data.gallery.forEach((item) => {
    assets.push(item.image.url)
  })

  about.data.gallery.forEach((item) => {
    assets.push(item.image.url)
  })

  about.data.body.forEach((section) => {
    if(section.slice_type === 'gallery'){
      section.items.forEach((item) => {
        assets.push(item.image.url)
      })
    }
  })

  collections.forEach((collection) => {
    collection.products.forEach((product) => {
      assets.push(product.products_product.data.product.url)
    })

  })

  return {assets, home, meta, preloader };
};

function handleLinkResolver(doc) {
  if (doc.type === "product") {
    return "/detail/" + doc.slug;
  }
  if (doc.type === "page") {
    return "/page/" + doc.uid;
  }
  return "/";
}

app.use(errorHandler());
app.use(logger("dev"));
app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const ua = uaParser(req.headers["user-agent"]);
  res.locals.isDesktop = ua.device.type === undefined;
  res.locals.isPhone = ua.device.type === "mobile";
  res.locals.isTablet = ua.device.type === "tablet";

  res.locals.Link = handleLinkResolver;

  // add PrismicDOM in locals to access them in templates.
  res.locals.PrismicDOM = PrismicDOM; // access to the prismic dome for the frontend
  res.locals.Numbers = (index) => {
    return index == 0
      ? "One"
      : index == 1
      ? "Two"
      : index == 2
      ? "Three"
      : index == 3
      ? "Four"
      : "";
  };
  next();
});
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

const fetchCollections = async (api) => {
  const response = await api.getAllByType("collection", {
    graphQuery: `
        {
          collection {
            title
            description
            products {
              products_product {

                  ...on product {
                title
                product

              }

              }
            }
          }
        }
      `,
  });

 return response.map((result) => result.data);
}

app.get("/", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const response = await api.getAllByType("collection", {
    graphQuery: `
        {
          collection {
            title
            description

          }
        }
      `,
  });

  const collections = response.map((result) => result.data);


  res.render("pages/home", {
    ...defaults,
    collections,
  });
});

app.get("/about", async (req, res) => {
  const api = await initApi(req);

  const defaults = await handleRequest(api);

  const about = await api.getSingle("about");

  res.render("pages/about", {
    about,
    ...defaults,
  });
});

app.get("/collections", async (req, res) => {
  const api = await initApi(req);
  const defaults = await handleRequest(api);

  const collections= await fetchCollections(api);

  res.render("pages/collections", {
    ...defaults,
    collections,
  });
});

app.get("/detail/:uid", async (req, res) => {
  const api = await initApi(req);

  const defaults = await handleRequest(api);

  const product = await api.getByUID("product", req.params.uid, {
    fetchLinks: "collection.title",
  });

  res.render("pages/detail", {
    ...defaults,
    product,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
