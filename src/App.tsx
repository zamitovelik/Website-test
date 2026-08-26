import { Route, Routes } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop';
import RequireAuth from '@/components/RequireAuth';
import Home from '@/pages/Home';
import Platform from '@/pages/Platform';
import Pricing from '@/pages/Pricing';
import Resources from '@/pages/Resources';
import Blog from '@/pages/Blog';
import Login from '@/pages/Login';
import Leads from '@/pages/Leads';
import Register from '@/pages/Register';
import Demo from '@/pages/Demo';
import Contact from '@/pages/Contact';
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/platform" element={<Platform />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/leads"
          element={
            <RequireAuth>
              <Leads />
            </RequireAuth>
          }
        />
        <Route path="/demo" element={<Demo />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
