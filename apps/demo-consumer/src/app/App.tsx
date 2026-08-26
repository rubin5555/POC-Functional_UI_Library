import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApiProvider } from "./ApiProvider";
import { Layout } from "./Layout";
import { Home } from "../routes/home/Home";
import { LitRoute } from "../routes/lit/LitRoute";
import { MithrilRoute } from "../routes/mithril/MithrilRoute";
import { StencilRoute } from "../routes/stencil/StencilRoute";

/**
 * The demo consumer represents an external product embedding the future
 * functional UI library. It constructs the API once (see {@link ApiProvider})
 * and consumes each technology only through its public package exports.
 */
export function App() {
  return (
    <ApiProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/lit" element={<LitRoute />} />
            <Route path="/mithril" element={<MithrilRoute />} />
            <Route path="/stencil" element={<StencilRoute />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ApiProvider>
  );
}
