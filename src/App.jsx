import { createPortal } from 'react-dom';

import {
  createBrowserRouter,
  RouterProvider,
  useRouteError
} from 'react-router-dom';

import RootLayout from 'pages/layout';

const ErrorPortal = ({ part }) => {
  const error = useRouteError();
  const stack = error instanceof Error ? (error?.stack ?? null) : null;
  console.error({ part, error });

  return createPortal(
    <div className="absolute inset-0 bg-[#ffffffc9] flex justify-center items-center">
      <div className="flex flex-col gap-10 max-w-[80%]">
        <div className="flex items-center justify-center">
          <div className="flex flex-col gap-4 max-w-lg">
            <h1 className="text-4xl font-extrabold">😞 We are deeply sorry</h1>

            <p>
              We truly apologize for the inconvenience. Something went a bit
              awry on our end. Please give it another shot in a few moments. If
              you continue to face this, reach out to our dedicated support
              team.
            </p>
            <p>we're here to help!</p>

            <div className="inline-flex">
              <Button onClick={() => window.location.reload()}>
                Try again
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

const pages = import.meta.glob('./pages/**/*.jsx', { eager: true });

const tree = Object.entries(pages).reduce((carry, [path, element]) => {
  const fileName = path.match(/\.\/pages\/(.*)\.jsx$/)?.[1];
  if (fileName === undefined) return;

  const normalizedPathName = fileName.includes('$')
    ? fileName.replaceAll('$', ':')
    : fileName;

  const parts = normalizedPathName.split('/').filter(Boolean);

  parts
    .filter(part => !['layout'].includes(part))
    .reduce((nodes, part, index) => {
      part = part.replaceAll('index', '');

      const node = nodes.find(node => node.path === part);

      if (!node) {
        const el =
          pages[
            `./pages/${parts
              .slice(0, index + 1)
              .map(part => (part === '' ? 'index' : part))
              .join('/')
              .replaceAll(':', '$')}/layout.jsx`
          ] ?? (index !== parts.length - 1 ? undefined : pages[path]);

        const Element =
          el?.default ?? (index !== parts.length - 1 ? undefined : el?.default);

        const ErrorBoundary = el?.error;

        const leaf = {
          path: part,

          loader: el?.loader,
          action: el?.action,

          errorElement: ErrorBoundary ? (
            <ErrorBoundary />
          ) : (
            <ErrorPortal part={part} />
          ),

          ...(Element && {
            element: el?.secured ? (
              <ProtectedRoute>
                <Element />
              </ProtectedRoute>
            ) : (
              <Element />
            )
          })
        };

        nodes.push(leaf);
        return (leaf.children = []);
      }

      if (index === parts.length - 1) {
        node.path = path;
      }

      return node.children || [];
    }, carry);

  return carry;
}, []);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: Object.values(tree),
    errorElement: <ErrorPortal part={'/'} />
  }
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
