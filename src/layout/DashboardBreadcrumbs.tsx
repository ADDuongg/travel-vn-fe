import { Link, useLocation, matchRoutes } from 'react-router-dom';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { routes } from '@/router';

const DashboardBreadcrumbs = () => {
  const location = useLocation();

  const matches = matchRoutes(routes as any, location) ?? [];

  const items = matches
    .filter((m) => (m.route as any).handle?.crumb)
    .map((m, idx, arr) => {
      const h = (m.route as any).handle!;
      const label =
        typeof h.crumb === 'function'
          ? h.crumb({ params: m.params, pathname: m.pathname })
          : h.crumb;
      const isLast = idx === arr.length - 1;
      return { to: m.pathname || '/', label, isLast };
    });

  if (items.length <= 1) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((it, i) => (
          <BreadcrumbItem key={it.to}>
            {it.isLast ? (
              <BreadcrumbPage>{it.label}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink asChild>
                <Link to={it.to}>{it.label}</Link>
              </BreadcrumbLink>
            )}
            {i < items.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumbs;

