# Images

Product photos currently load from external URLs (Unsplash) directly in
each page component, so this folder is empty by default.

To use local images instead: drop files here, then import them like any
other asset, e.g.

    import heroImg from "../assets/images/hero.jpg";

and use `heroImg` as the `src` in place of the URL string.
