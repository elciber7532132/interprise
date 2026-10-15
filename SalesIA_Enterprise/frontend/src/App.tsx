
import { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, ArrowDownRight, ArrowUpRight, Bell, Boxes,
  BriefcaseBusiness, Calculator, CalendarDays, Check, ChevronDown,
  ChevronLeft, ChevronRight, CircleHelp, CreditCard, Download,
  FileBarChart, FileText, Filter, LayoutDashboard, Lightbulb, LogOut,
  Menu, MoreHorizontal, Package, Plus, Search, Settings, ShieldCheck,
  ShoppingCart, SlidersHorizontal, Sparkles, TrendingUp, Users, X, Zap
} from 'lucide-react';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis
} from 'recharts';

type Customer = {
  id: number;
  name: string;
  doc: string;
  type: string;
  email: string;
  phone: string;
  address: string;
};

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
};

type Sale = {
  id: string;
  customer: string;
  date: string;
  status: string;
  total: number;
  items: number;
  document_type?: string;
  documentType?: string;
};

type CartItem = {
  product: Product;
  qty: number;
};

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: 'Comercial Andina S.A.C.',
    doc: '20604578123',
    type: 'Empresa',
    email: 'compras@andina.pe',
    phone: '(01) 445-8832',
    address: 'Av. Javier Prado 1840, San Isidro, Lima'
  },
  {
    id: 2,
    name: 'Inversiones del Pacífico E.I.R.L.',
    doc: '20517893461',
    type: 'Empresa',
    email: 'administracion@pacifico.pe',
    phone: '(01) 441-7620',
    address: 'Av. La Marina 2250, San Miguel, Lima'
  },
  {
    id: 3,
    name: 'María Fernanda Torres',
    doc: '46892157',
    type: 'Persona',
    email: 'maria.torres@email.com',
    phone: '987 654 321',
    address: 'Calle Los Olivos 324, Miraflores, Lima'
  },
  {
    id: 4,
    name: 'Grupo Horizonte Perú S.A.C.',
    doc: '20608912456',
    type: 'Empresa',
    email: 'contacto@horizonte.pe',
    phone: '(01) 505-1290',
    address: 'Jr. Las Begonias 475, Surco, Lima'
  }
];

const initialProducts: Product[] = [
  { id: 1, name: 'Laptop empresarial Pro 14', sku: 'TEC-001', category: 'Tecnología', price: 3299, stock: 24 },
  { id: 2, name: 'Monitor profesional 27”', sku: 'TEC-002', category: 'Tecnología', price: 899, stock: 18 },
  { id: 3, name: 'Silla ergonómica ejecutiva', sku: 'MOB-014', category: 'Mobiliario', price: 749, stock: 7 },
  { id: 4, name: 'Teclado inalámbrico Business', sku: 'ACC-021', category: 'Accesorios', price: 149, stock: 62 },
  { id: 5, name: 'Estación de acoplamiento USB-C', sku: 'TEC-031', category: 'Tecnología', price: 429, stock: 3 }
];

const initialSales: Sale[] = [
  { id: 'VTA-2026-0084', customer: 'Comercial Andina S.A.C.', date: '15 oct 2026', status: 'Pagada', total: 6598, items: 2, document_type: 'Factura' },
  { id: 'VTA-2026-0083', customer: 'Grupo Horizonte Perú S.A.C.', date: '15 oct 2026', status: 'Pendiente', total: 1798, items: 2, document_type: 'Factura' },
  { id: 'VTA-2026-0082', customer: 'María Fernanda Torres', date: '14 oct 2026', status: 'Pagada', total: 899, items: 1, document_type: 'Boleta de venta' },
  { id: 'VTA-2026-0081', customer: 'Inversiones del Pacífico E.I.R.L.', date: '13 oct 2026', status: 'Anulada', total: 1498, items: 2, document_type: 'Factura' },
  { id: 'VTA-2026-0080', customer: 'Comercial Andina S.A.C.', date: '12 oct 2026', status: 'Pagada', total: 4048, items: 3, document_type: 'Factura' }
];

const trend = [
  { month: 'May', ventas: 28000, ordenes: 34 },
  { month: 'Jun', ventas: 36500, ordenes: 42 },
  { month: 'Jul', ventas: 31800, ordenes: 39 },
  { month: 'Ago', ventas: 45200, ordenes: 51 },
  { month: 'Sep', ventas: 42600, ordenes: 48 },
  { month: 'Oct', ventas: 52780, ordenes: 63 }
];

const money = (n: number) =>
  new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    maximumFractionDigits: 2
  }).format(n);

const nav = [
  {
    title: 'GENERAL',
    items: [
      ['Panel ejecutivo', LayoutDashboard],
      ['Ventas', ShoppingCart]
    ]
  },
  {
    title: 'OPERACIONES',
    items: [
      ['Inventario', Boxes],
      ['Vendedores', BriefcaseBusiness]
    ]
  },
  {
    title: 'INTELIGENCIA COMERCIAL',
    items: [
      ['Analytics', Activity],
      ['Probabilidad y Bayes', Calculator],
      ['Insights', Lightbulb]
    ]
  },
  {
    title: 'GESTIÓN',
    items: [
      ['Reportes', FileBarChart],
      ['Seguridad', ShieldCheck]
    ]
  }
] as const;

const normalizeSalesText = (value: unknown) =>
  String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const salesDateISO = (value: string) => {
  if (!value) return '';

  const input = value.trim();
  const iso = input.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const numeric = input.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);

  if (numeric) {
    return `${numeric[3]}-${numeric[2].padStart(2, '0')}-${numeric[1].padStart(2, '0')}`;
  }

  const months: Record<string, string> = {
    ene: '01', enero: '01',
    feb: '02', febrero: '02',
    mar: '03', marzo: '03',
    abr: '04', abril: '04',
    may: '05', mayo: '05',
    jun: '06', junio: '06',
    jul: '07', julio: '07',
    ago: '08', agosto: '08',
    sep: '09', set: '09',
    septiembre: '09', setiembre: '09',
    oct: '10', octubre: '10',
    nov: '11', noviembre: '11',
    dic: '12', diciembre: '12'
  };

  const spanish = input.toLowerCase().match(
    /^(\d{1,2})\s+([a-záéíóú]+)\.?\s+(\d{4})$/
  );

  if (spanish) {
    const month = months[normalizeSalesText(spanish[2])];

    if (month) {
      return `${spanish[3]}-${month}-${spanish[1].padStart(2, '0')}`;
    }
  }

  return '';
};

const getSaleDocument = (sale: Sale) =>
  sale.document_type || sale.documentType || '';

export default function App() {
  const [page, setPage] = useState('Panel ejecutivo');
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [sales, setSales] = useState<Sale[]>(initialSales);

  const [search, setSearch] = useState('');
  const [modal, setModal] = useState<'sale' | 'customer' | 'product' | null>(null);
  const [pickSearch, setPickSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [range, setRange] = useState('Últimos 6 meses');
  const [docType, setDocType] = useState('Factura');
  const [discount, setDiscount] = useState(0);

  const [showSalesFilters, setShowSalesFilters] = useState(false);
  const [salesSearch, setSalesSearch] = useState('');
  const [salesDateFrom, setSalesDateFrom] = useState('');
  const [salesDateTo, setSalesDateTo] = useState('');
  const [salesNumber, setSalesNumber] = useState('');
  const [salesCustomer, setSalesCustomer] = useState('');
  const [salesStatus, setSalesStatus] = useState('');
  const [salesDocumentType, setSalesDocumentType] = useState('');
  const [salesMinAmount, setSalesMinAmount] = useState('');
  const [salesMaxAmount, setSalesMaxAmount] = useState('');
  const [salesSort, setSalesSort] = useState('date-desc');

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const tax = Math.max(0, subtotal - discount) * 0.18;
  const total = Math.max(0, subtotal - discount) + tax;

  const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!API_BASE) return;

      try {
        const [customerResponse, productResponse, salesResponse] = await Promise.all([
          fetch(`${API_BASE}/customers`),
          fetch(`${API_BASE}/products`),
          fetch(`${API_BASE}/sales`)
        ]);

        if (!customerResponse.ok || !productResponse.ok || !salesResponse.ok) {
          throw new Error('API no disponible');
        }

        const [customerData, productData, salesData] = await Promise.all([
          customerResponse.json(),
          productResponse.json(),
          salesResponse.json()
        ]);

        if (!active) return;

        setCustomers(customerData);
        setProducts(productData);
        setSales(salesData);
      } catch {
        // Mantiene los datos de demostración si la API no está disponible.
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [API_BASE]);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2800);
  };

  const invalidSalesAmount =
    salesMinAmount !== '' &&
    salesMaxAmount !== '' &&
    Number(salesMinAmount) > Number(salesMaxAmount);

  const filteredSales = useMemo(() => {
    if (invalidSalesAmount) return [];

    const result = sales.filter((sale) => {
      const date = salesDateISO(sale.date);
      const text = normalizeSalesText(
        `${sale.id} ${sale.customer} ${sale.status} ${getSaleDocument(sale)}`
      );

      return (
        (!salesSearch || text.includes(normalizeSalesText(salesSearch))) &&
        (!salesNumber || sale.id.toLowerCase().includes(salesNumber.toLowerCase())) &&
        (!salesCustomer || sale.customer === salesCustomer) &&
        (!salesStatus || normalizeSalesText(sale.status) === normalizeSalesText(salesStatus)) &&
        (!salesDocumentType || normalizeSalesText(getSaleDocument(sale)) === normalizeSalesText(salesDocumentType)) &&
        (!salesDateFrom || (date !== '' && date >= salesDateFrom)) &&
        (!salesDateTo || (date !== '' && date <= salesDateTo)) &&
        (salesMinAmount === '' || sale.total >= Number(salesMinAmount)) &&
        (salesMaxAmount === '' || sale.total <= Number(salesMaxAmount))
      );
    });

    return result.sort((a, b) => {
      if (salesSort === 'date-asc') return salesDateISO(a.date).localeCompare(salesDateISO(b.date));
      if (salesSort === 'date-desc') return salesDateISO(b.date).localeCompare(salesDateISO(a.date));
      if (salesSort === 'amount-asc') return a.total - b.total;
      if (salesSort === 'amount-desc') return b.total - a.total;
      if (salesSort === 'number-asc') return a.id.localeCompare(b.id, undefined, { numeric: true });
      if (salesSort === 'number-desc') return b.id.localeCompare(a.id, undefined, { numeric: true });
      return 0;
    });
  }, [
    sales, salesSearch, salesNumber, salesCustomer, salesStatus,
    salesDocumentType, salesDateFrom, salesDateTo, salesMinAmount,
    salesMaxAmount, salesSort, invalidSalesAmount
  ]);

  const clearSalesFilters = () => {
    setSalesSearch('');
    setSalesDateFrom('');
    setSalesDateTo('');
    setSalesNumber('');
    setSalesCustomer('');
    setSalesStatus('');
    setSalesDocumentType('');
    setSalesMinAmount('');
    setSalesMaxAmount('');
    setSalesSort('date-desc');
  };

  const addProduct = (product: Product) => {
    if (product.stock <= 0) {
      notify('Este producto no tiene unidades disponibles.');
      return;
    }

    setCart((previous) => {
      const found = previous.find((item) => item.product.id === product.id);

      if (found) {
        if (found.qty >= product.stock) {
          notify('No hay más unidades disponibles de este producto.');
          return previous;
        }

        return previous.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }

      return [...previous, { product, qty: 1 }];
    });

    setModal('sale');
    setPickSearch('');
  };

  const addSale = async () => {
    if (!selectedCustomer || cart.length === 0) {
      notify('Selecciona un cliente y al menos un producto.');
      return;
    }

    if (cart.some((item) => item.qty > item.product.stock)) {
      notify('La cantidad de un producto supera el stock disponible.');
      return;
    }

    try {
      if (API_BASE) {
        const response = await fetch(`${API_BASE}/sales`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            customer_id: selectedCustomer.id,
            document_type: docType,
            issue_date: new Date().toISOString().slice(0, 10),
            discount,
            tax_rate: 0.18,
            items: cart.map((item) => ({
              product_id: item.product.id,
              quantity: item.qty
            }))
          })
        });

        const body = await response.json();

        if (!response.ok) {
          throw new Error(
            typeof body.detail === 'string'
              ? body.detail
              : 'No se pudo registrar la venta.'
          );
        }

        const [salesResponse, productsResponse] = await Promise.all([
          fetch(`${API_BASE}/sales`),
          fetch(`${API_BASE}/products`)
        ]);

        if (salesResponse.ok) setSales(await salesResponse.json());
        if (productsResponse.ok) setProducts(await productsResponse.json());
      } else {
        const nextNumber = 85 + Math.max(0, sales.length - initialSales.length);

        const newSale: Sale = {
          id: `VTA-2026-${String(nextNumber).padStart(4, '0')}`,
          customer: selectedCustomer.name,
          date: new Date().toLocaleDateString('es-PE', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          }),
          status: 'Pendiente',
          total,
          items: cart.reduce((sum, item) => sum + item.qty, 0),
          document_type: docType
        };

        setSales((previous) => [newSale, ...previous]);

        setProducts((previous) =>
          previous.map((product) => ({
            ...product,
            stock: Math.max(
              0,
              product.stock -
                (cart.find((item) => item.product.id === product.id)?.qty || 0)
            )
          }))
        );
      }

      setCart([]);
      setSelectedCustomer(null);
      setDiscount(0);
      setModal(null);
      setPage('Ventas');
      notify('Venta registrada correctamente. Estado: pendiente de pago.');
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : 'Error al conectar con el servidor.'
      );
    }
  };

  const subtitle: Record<string, string> = {
    'Panel ejecutivo': 'Una visión clara del rendimiento de tu negocio.',
    Ventas: 'Administra órdenes, documentos, pagos y seguimiento comercial.',
    Inventario: 'Control de existencias y movimientos de productos.',
    Vendedores: 'Rendimiento comercial y seguimiento por vendedor.',
    Analytics: 'Convierte las operaciones reales en decisiones basadas en datos.',
    'Probabilidad y Bayes': 'Explora probabilidades y escenarios comerciales.',
    Insights: 'Hallazgos explicables basados en los resultados del negocio.',
    Reportes: 'Consulta y prepara informes comerciales y estadísticos.',
    Seguridad: 'Control de acceso, roles y trazabilidad de operaciones.'
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'mobile-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Activity size={22} /></div>
          <div>
            <div className="brand-name">SalesIA<span>Enterprise</span></div>
            <div className="brand-sub">BUSINESS INTELLIGENCE</div>
          </div>
          <button className="icon-btn sidebar-close" onClick={() => setMobileNav(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="company-switch">
          <div className="company-icon">SE</div>
          <div className="company-copy">
            <b>SalesIA Enterprise</b>
            <span>Plan empresarial</span>
          </div>
          <ChevronDown size={15} />
        </div>

        <div className="nav-wrap">
          {nav.map((group) => (
            <div className="nav-group" key={group.title}>
              <div className="nav-label">{group.title}</div>
              {group.items.map(([label, Icon]) => (
                <button
                  key={label}
                  onClick={() => {
                    setPage(label);
                    setMobileNav(false);
                  }}
                  className={`nav-item ${page === label ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                  {label === 'Ventas' && <span className="nav-count">{sales.length}</span>}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          <div className="help-card">
            <div className="help-icon"><CircleHelp size={17} /></div>
            <div>
              <b>¿Necesitas ayuda?</b>
              <span>Consulta la guía del sistema</span>
            </div>
            <ChevronRight size={15} />
          </div>
          <div className="profile">
            <div className="avatar">RS</div>
            <div className="profile-info">
              <b>Raúl Sandoval</b>
              <span>Administrador</span>
            </div>
            <button
              className="icon-btn"
              title="Cerrar sesión"
              onClick={() => notify('La autenticación se conectará con el backend.')}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="top-left">
            <button className="icon-btn mobile-menu" onClick={() => setMobileNav(!mobileNav)}>
              <Menu size={20} />
            </button>
            <div className="breadcrumb">Workspace <ChevronRight size={14} /><b>{page}</b></div>
          </div>
          <div className="top-actions">
            <div className="system-status"><span /> Sistema operativo</div>
            <button
              className="icon-btn notification"
              onClick={() => notify('No tienes notificaciones nuevas.')}
            >
              <Bell size={18} /><i />
            </button>
            <div className="top-divider" />
            <div className="top-avatar">RS</div>
          </div>
        </header>

        <div className="content">
          <div className="page-heading">
            <div>
              <div className="eyebrow">SALESIA / {page.toUpperCase()}</div>
              <h1>{page}</h1>
              <p>{subtitle[page]}</p>
            </div>

            <div className="heading-actions">
              {page === 'Ventas' ? (
                <>
                  <button className="btn btn-secondary" onClick={() => notify('Preparando exportación de ventas…')}>
                    <Download size={16} /> Exportar
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setModal('sale');
                      setSelectedCustomer(null);
                      setCart([]);
                    }}
                  >
                    <Plus size={17} /> Nueva venta
                  </button>
                </>
              ) : page === 'Panel ejecutivo' ? (
                <>
                  <button
                    className="btn btn-secondary"
                    onClick={() => notify('El selector de fechas se conectará con los datos del sistema.')}
                  >
                    <CalendarDays size={16} /> 15 oct 2026 <ChevronDown size={14} />
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setPage('Ventas');
                      setModal('sale');
                    }}
                  >
                    <Plus size={17} /> Registrar venta
                  </button>
                </>
              ) : (
                <button
                  className="btn btn-secondary"
                  onClick={() => notify('La información está lista para conectarse a la API.')}
                >
                  <SlidersHorizontal size={16} /> Configurar vista
                </button>
              )}
            </div>
          </div>

          {page === 'Panel ejecutivo' && (
            <>
              <div className="welcome-banner">
                <div className="welcome-content">
                  <div className="welcome-chip"><Sparkles size={13} /> RESUMEN EJECUTIVO</div>
                  <h2>Buenos días, Raúl <span>👋</span></h2>
                  <p>Este es el resumen de actividad comercial de SalesIA Enterprise.</p>
                  <div className="welcome-foot">
                    <span><span className="live-dot" /> Datos de demostración</span>
                    <span>·</span>
                    <span>Actualizado al 15 de octubre de 2026</span>
                  </div>
                </div>
                <div className="banner-art">
                  <div className="art-ring ring-one" />
                  <div className="art-ring ring-two" />
                  <div className="art-core"><TrendingUp size={38} /></div>
                  <div className="art-float float-a"><ArrowUpRight size={16} /><b>+18.6%</b></div>
                  <div className="art-float float-b"><Activity size={16} /><b>Actividad comercial</b></div>
                </div>
              </div>

              <div className="section-head">
                <div><h2>Indicadores clave</h2><p>Rendimiento comercial del periodo seleccionado</p></div>
                <button
                  className="filter-button"
                  onClick={() => setRange(range === 'Últimos 6 meses' ? 'Este año' : 'Últimos 6 meses')}
                >
                  <Filter size={15} /> {range} <ChevronDown size={14} />
                </button>
              </div>

              <div className="kpi-grid">
                <Kpi icon={<ShoppingCart />} label="Ventas registradas" value={String(sales.length)} change="12.8%" note="registros actuales" positive />
                <Kpi icon={<CreditCard />} label="Ingresos totales" value={money(sales.reduce((sum, sale) => sum + sale.total, 0))} change="8.4%" note="según ventas cargadas" positive />
                <Kpi icon={<Users />} label="Clientes activos" value={String(customers.length)} change="Catálogo" note="clientes registrados" positive />
                <Kpi icon={<Package />} label="Productos en stock" value={String(products.reduce((sum, product) => sum + product.stock, 0))} change="Inventario" note="unidades disponibles" positive={false} />
              </div>

              <div className="dashboard-grid">
                <section className="panel revenue-panel">
                  <div className="panel-head">
                    <div><h3>Evolución de ventas</h3><p>Ingresos de referencia por mes</p></div>
                    <button className="dots-btn" onClick={() => notify('Gráfico de ventas')}><MoreHorizontal size={19} /></button>
                  </div>
                  <div className="chart-legend">
                    <span><i className="legend-dot cyan" /> Ingresos</span>
                    <span className="chart-total">S/ 52,780 <em><ArrowUpRight size={13} /> 18.6%</em></span>
                  </div>
                  <div className="chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trend} margin={{ top: 10, right: 5, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#16b8c8" stopOpacity={0.22} />
                            <stop offset="95%" stopColor="#16b8c8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e9eef4" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#8794a7', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8794a7', fontSize: 11 }} tickFormatter={(value) => `${value / 1000}k`} width={36} />
                        <Tooltip formatter={(value) => money(Number(value))} />
                        <Area type="monotone" dataKey="ventas" stroke="#11aebe" strokeWidth={2.5} fill="url(#fillSales)" activeDot={{ r: 5, strokeWidth: 0 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="chart-bottom">
                    <span><i className="legend-dot cyan" /> Ingresos de referencia</span>
                    <span>Moneda: PEN (S/)</span>
                  </div>
                </section>

                <section className="panel orders-panel">
                  <div className="panel-head">
                    <div><h3>Actividad de ventas</h3><p>Estado de las operaciones registradas</p></div>
                    <button className="dots-btn" onClick={() => setPage('Ventas')}><MoreHorizontal size={19} /></button>
                  </div>
                  <div className="donut-wrap">
                    <div className="donut">
                      <div className="donut-center"><b>{sales.length}</b><span>Ventas</span></div>
                    </div>
                    <div className="donut-legend">
                      <Legend color="#16b8c8" label="Pagadas" value={String(sales.filter((sale) => sale.status === 'Pagada').length)} percent="Pagadas" />
                      <Legend color="#4779d8" label="Pendientes" value={String(sales.filter((sale) => sale.status === 'Pendiente').length)} percent="Pendientes" />
                      <Legend color="#e8edf3" label="Anuladas" value={String(sales.filter((sale) => sale.status === 'Anulada').length)} percent="Anuladas" />
                    </div>
                  </div>
                  <button className="text-link" onClick={() => setPage('Ventas')}>Ver todas las ventas <ChevronRight size={15} /></button>
                </section>
              </div>

              <div className="section-head recent-head">
                <div><h2>Ventas recientes</h2><p>Últimas operaciones registradas en el sistema</p></div>
                <button className="text-link" onClick={() => setPage('Ventas')}>Ver todas <ChevronRight size={15} /></button>
              </div>
              <SalesTable sales={sales.slice(0, 4)} onClick={() => setPage('Ventas')} />

              <div className="bottom-grid">
                <section className="panel mini-panel">
                  <div className="panel-head">
                    <div><h3>Productos destacados</h3><p>Por unidades disponibles</p></div>
                    <button className="dots-btn" onClick={() => setPage('Inventario')}><MoreHorizontal size={18} /></button>
                  </div>
                  {products.slice(0, 3).map((product, index) => (
                    <div className="product-line" key={product.id}>
                      <div className={`product-icon p${index}`}><Package size={17} /></div>
                      <div className="product-name"><b>{product.name}</b><span>{product.sku}</span></div>
                      <div className="product-stock"><b>{product.stock}</b><span>unidades</span></div>
                    </div>
                  ))}
                </section>
                <section className="insight-card">
                  <div className="insight-heading">
                    <div className="insight-symbol"><Zap size={18} /></div>
                    <span>INSIGHT AUTOMÁTICO</span><span className="new-pill">INFO</span>
                  </div>
                  <h3>Resumen comercial</h3>
                  <p>Consulta los ingresos, revisa las ventas pendientes y controla los productos con menor disponibilidad para planificar tus próximas operaciones.</p>
                  <button className="insight-link" onClick={() => setPage('Insights')}>Explorar insights <ChevronRight size={15} /></button>
                </section>
              </div>
            </>
          )}

          {page === 'Ventas' && (
            <>
              <div className="sales-summary">
                <div><span>Ventas en esta vista</span><b>{filteredSales.length}</b></div>
                <div><span>Importe listado</span><b>{money(filteredSales.reduce((sum, sale) => sum + sale.total, 0))}</b></div>
                <div><span>Pendientes de pago</span><b>{sales.filter((sale) => sale.status === 'Pendiente').length}</b></div>
              </div>

              <div className="panel table-panel">
                <div className="table-toolbar">
                  <div className="searchbox">
                    <Search size={17} />
                    <input value={salesSearch} onChange={(event) => setSalesSearch(event.target.value)} placeholder="Buscar por número, cliente, estado o documento..." />
                  </div>
                  <button className="btn btn-secondary" onClick={() => setShowSalesFilters((value) => !value)}>
                    <Filter size={15} /> Filtros <ChevronDown size={14} />
                  </button>
                  <button className="btn btn-secondary" onClick={clearSalesFilters}><X size={15} /> Limpiar</button>
                </div>

                {showSalesFilters && (
                  <div style={{ padding: 16, marginBottom: 16, border: '1px solid #e1e5eb', borderRadius: 12, background: '#fafbfc' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(175px,1fr))', gap: 12 }}>
                      <label className="filter-field">Fecha desde<input type="date" value={salesDateFrom} max={salesDateTo || undefined} onChange={(event) => setSalesDateFrom(event.target.value)} /></label>
                      <label className="filter-field">Fecha hasta<input type="date" value={salesDateTo} min={salesDateFrom || undefined} onChange={(event) => setSalesDateTo(event.target.value)} /></label>
                      <label className="filter-field">Número de venta<input value={salesNumber} onChange={(event) => setSalesNumber(event.target.value)} placeholder="Ej. VTA-2026-0084" /></label>
                      <label className="filter-field">Cliente
                        <select value={salesCustomer} onChange={(event) => setSalesCustomer(event.target.value)}>
                          <option value="">Todos los clientes</option>
                          {[...new Set(sales.map((sale) => sale.customer).filter(Boolean))].sort().map((name) => <option key={name} value={name}>{name}</option>)}
                        </select>
                      </label>
                      <label className="filter-field">Estado
                        <select value={salesStatus} onChange={(event) => setSalesStatus(event.target.value)}>
                          <option value="">Todos los estados</option>
                          {[...new Set(sales.map((sale) => sale.status).filter(Boolean))].sort().map((status) => <option key={status} value={status}>{status}</option>)}
                        </select>
                      </label>
                      <label className="filter-field">Tipo de documento
                        <select value={salesDocumentType} onChange={(event) => setSalesDocumentType(event.target.value)}>
                          <option value="">Todos los documentos</option>
                          {[...new Set(sales.map(getSaleDocument).filter(Boolean))].sort().map((type) => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </label>
                      <label className="filter-field">Monto mínimo (S/)<input type="number" min="0" step="0.01" value={salesMinAmount} onChange={(event) => setSalesMinAmount(event.target.value)} /></label>
                      <label className="filter-field">Monto máximo (S/)<input type="number" min="0" step="0.01" value={salesMaxAmount} onChange={(event) => setSalesMaxAmount(event.target.value)} /></label>
                      <label className="filter-field">Ordenar por
                        <select value={salesSort} onChange={(event) => setSalesSort(event.target.value)}>
                          <option value="date-desc">Fecha: más reciente</option>
                          <option value="date-asc">Fecha: más antigua</option>
                          <option value="amount-desc">Monto: mayor a menor</option>
                          <option value="amount-asc">Monto: menor a mayor</option>
                          <option value="number-asc">Número: ascendente</option>
                          <option value="number-desc">Número: descendente</option>
                        </select>
                      </label>
                    </div>
                    {invalidSalesAmount && <p style={{ color: '#b42318', fontSize: 13 }}>El monto mínimo no puede ser mayor que el máximo.</p>}
                  </div>
                )}

                <SalesTable sales={filteredSales} onClick={() => notify('Selecciona Nueva venta para registrar una operación.')} full />
                <div className="table-footer">
                  <span>Mostrando {filteredSales.length} de {sales.length} registros</span>
                  <div className="pagination">
                    <button disabled><ChevronLeft size={15} /></button>
                    <button className="current">1</button>
                    <button disabled>2</button>
                    <button disabled><ChevronRight size={15} /></button>
                  </div>
                </div>
              </div>
            </>
          )}

          {page === 'Inventario' && (
            <>
              <div className="kpi-grid">
                <Kpi icon={<Boxes />} label="Referencias activas" value={String(products.length)} change="Catálogo" note="productos" />
                <Kpi icon={<Package />} label="Unidades disponibles" value={String(products.reduce((sum, product) => sum + product.stock, 0))} change="Stock actual" note="unidades" />
                <Kpi icon={<AlertCircle />} label="Stock bajo" value={String(products.filter((product) => product.stock < 8).length)} change="Requiere atención" note="referencias" positive={false} />
                <Kpi icon={<TrendingUp />} label="Valor de inventario" value={money(products.reduce((sum, product) => sum + product.price * product.stock, 0))} change="Valor referencial" note="según precio actual" />
              </div>

              <div className="panel table-panel">
                <div className="table-toolbar">
                  <div className="searchbox">
                    <Search size={17} />
                    <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar producto o SKU..." />
                  </div>
                  <button className="btn btn-primary" onClick={() => { setModal('product'); setPickSearch(''); }}>
                    <Plus size={16} /> Nuevo producto
                  </button>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>PRODUCTO</th><th>SKU</th><th>CATEGORÍA</th><th>PRECIO</th><th>STOCK</th><th>ESTADO</th></tr></thead>
                    <tbody>
                      {products.filter((product) => (product.name + product.sku + product.category).toLowerCase().includes(search.toLowerCase())).map((product) => (
                        <tr key={product.id}>
                          <td><div className="cell-product"><div className="small-product-icon"><Package size={17} /></div><b>{product.name}</b></div></td>
                          <td className="muted-cell">{product.sku}</td>
                          <td>{product.category}</td>
                          <td className="money-cell">{money(product.price)}</td>
                          <td><b>{product.stock}</b> <span className="muted-cell">unid.</span></td>
                          <td><span className={`status ${product.stock < 8 ? 'status-pending' : 'status-paid'}`}>{product.stock < 8 ? 'Stock bajo' : 'Disponible'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && <div className="empty-table">No hay productos registrados.</div>}
                </div>
              </div>
            </>
          )}

          {page === 'Vendedores' && (
            <div className="panel placeholder-panel">
              <div className="placeholder-icon"><BriefcaseBusiness size={25} /></div>
              <h2>Rendimiento de vendedores</h2>
              <p>Consulta ventas, ingresos y promedio por vendedor. Esta sección requiere conectar los registros de ventas con los datos de los empleados.</p>
              <div className="placeholder-metrics">
                <div><span>Vendedores activos</span><b>12</b></div>
                <div><span>Ventas registradas</span><b>{sales.length}</b></div>
                <div><span>Importe registrado</span><b>{money(sales.reduce((sum, sale) => sum + sale.total, 0))}</b></div>
              </div>
              <button className="btn btn-primary" onClick={() => notify('El módulo detallado se implementará conectado a la API.')}>Ver análisis de vendedores</button>
            </div>
          )}

          {page === 'Analytics' && (
            <>
              <div className="kpi-grid">
                <Kpi icon={<TrendingUp />} label="Ingresos analizados" value={money(sales.reduce((sum, sale) => sum + sale.total, 0))} change="Ventas cargadas" note="importe total" />
                <Kpi icon={<Calculator />} label="Media de venta" value={money(sales.length ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0)} change="Media aritmética" note="por transacción" />
                <Kpi icon={<Activity />} label="Mediana de venta" value={money(median(sales.map((sale) => sale.total)))} change="Valor central" note="de las ventas" />
                <Kpi icon={<Users />} label="Clientes compradores" value={String(new Set(sales.map((sale) => sale.customer)).size)} change="Clientes" note="con ventas registradas" />
              </div>
              <div className="dashboard-grid">
                <section className="panel revenue-panel">
                  <div className="panel-head"><div><h3>Ingresos por periodo</h3><p>Datos de referencia por mes</p></div></div>
                  <div className="chart-area">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={trend}>
                        <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#e9eef4" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                        <Tooltip formatter={(value) => money(Number(value))} />
                        <Bar dataKey="ventas" fill="#13b8c8" radius={[5, 5, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </section>
                <section className="panel orders-panel">
                  <div className="panel-head"><div><h3>Resumen estadístico</h3><p>Calculado con los registros cargados</p></div></div>
                  <div className="stat-list">
                    <div><span>Media aritmética</span><b>{money(sales.length ? sales.reduce((sum, sale) => sum + sale.total, 0) / sales.length : 0)}</b></div>
                    <div><span>Mediana</span><b>{money(median(sales.map((sale) => sale.total)))}</b></div>
                    <div><span>Variable analizada</span><b>Monto de venta</b></div>
                    <div><span>Observaciones</span><b>{sales.length} registros</b></div>
                  </div>
                </section>
              </div>
              <div className="info-note">
                <Sparkles size={18} />
                <div><b>Analítica basada en operaciones</b><p>Estos indicadores se calculan con los registros disponibles en esta interfaz. Para producción, utiliza los datos persistidos en PostgreSQL.</p></div>
              </div>
            </>
          )}

          {page === 'Probabilidad y Bayes' && <BayesCard notify={notify} apiBase={API_BASE} />}

          {page === 'Insights' && (
            <div className="insights-grid">
              <div className="insight-card">
                <div className="insight-heading"><div className="insight-symbol"><TrendingUp size={18} /></div><span>VENTAS</span><span className="new-pill">RESUMEN</span></div>
                <h3>Actividad comercial</h3>
                <p>Se han cargado {sales.length} ventas con un importe total de {money(sales.reduce((sum, sale) => sum + sale.total, 0))}. Revisa periódicamente los estados y los importes registrados.</p>
                <div className="evidence">Evidencia: registros de ventas actuales.</div>
              </div>
              <div className="insight-card">
                <div className="insight-heading"><div className="insight-symbol amber"><AlertCircle size={18} /></div><span>INVENTARIO</span><span className="new-pill warning">ATENCIÓN</span></div>
                <h3>Productos con stock bajo</h3>
                <p>{products.filter((product) => product.stock < 8).map((product) => product.name).join(', ') || 'No hay productos bajo el umbral de stock.'}.</p>
                <div className="evidence">Evidencia: stock registrado en el catálogo.</div>
              </div>
              <div className="insight-card">
                <div className="insight-heading"><div className="insight-symbol purple"><Calculator size={18} /></div><span>ESTADÍSTICA</span></div>
                <h3>Media y mediana</h3>
                <p>Comparar la media de venta con la mediana permite identificar si las ventas de importe elevado están influyendo en el promedio.</p>
                <div className="evidence">Método: análisis de distribución de importes.</div>
              </div>
            </div>
          )}

          {page === 'Reportes' && (
            <div className="report-grid">
              {[
                ['Reporte de ventas', 'Detalle de operaciones, estados e importes', FileText],
                ['Reporte de productos', 'Catálogo, rotación y existencias', Package],
                ['Reporte de clientes', 'Historial y comportamiento comercial', Users],
                ['Reporte estadístico', 'Media, mediana y variables analizadas', Calculator],
                ['Reporte de vendedores', 'Resultados por vendedor', BriefcaseBusiness],
                ['Historial de análisis', 'Resultados guardados e insights', Activity]
              ].map(([name, description, Icon]: any) => (
                <button className="report-card" key={name} onClick={() => {
                  if (name === 'Reporte de ventas') setPage('Ventas');
                  else if (name === 'Reporte de productos') setPage('Inventario');
                  else if (name === 'Reporte estadístico') setPage('Analytics');
                  else notify(`El ${String(name).toLowerCase()} requiere completar su conexión de datos.`);
                }}>
                  <div className="report-icon"><Icon size={21} /></div>
                  <div><b>{name}</b><p>{description}</p><span>Ver reporte <ChevronRight size={14} /></span></div>
                  <Download size={17} className="report-download" />
                </button>
              ))}
            </div>
          )}

          {page === 'Seguridad' && (
            <>
              <div className="sales-summary">
                <div><span>Usuarios registrados</span><b>08</b></div>
                <div><span>Roles propuestos</span><b>05</b></div>
                <div><span>Estado de auditoría</span><b>Preparado</b></div>
              </div>
              <div className="panel table-panel">
                <div className="panel-head pad-head">
                  <div><h3>Roles y permisos del sistema</h3><p>Propuesta de control de acceso por responsabilidad</p></div>
                  <button className="btn btn-secondary" onClick={() => notify('La administración de usuarios se conectará con el backend.')}><Settings size={15} /> Configuración</button>
                </div>
                <div className="table-scroll">
                  <table>
                    <thead><tr><th>ROL</th><th>RESPONSABILIDAD</th><th>ACCESO</th></tr></thead>
                    <tbody>
                      {[
                        ['Administrador', 'Configuración, usuarios, roles y parámetros', 'Completo'],
                        ['Gerente', 'Indicadores, Analytics, reportes y resultados', 'Consulta'],
                        ['Vendedor', 'Registro de clientes, pedidos y ventas autorizadas', 'Comercial'],
                        ['Analista', 'Análisis estadístico, insights y reportes', 'Analítica'],
                        ['Almacén', 'Stock y movimientos de inventario', 'Inventario']
                      ].map((role) => (
                        <tr key={role[0]}><td><b>{role[0]}</b></td><td>{role[1]}</td><td><span className="status status-paid">{role[2]}</span></td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="info-note">
                <ShieldCheck size={18} />
                <div><b>Seguridad de producción</b><p>La autenticación, los permisos por endpoint, las sesiones y la auditoría requieren integración real con FastAPI. Esta interfaz no afirma que esos controles ya estén activos.</p></div>
              </div>
            </>
          )}

          <footer className="footer">
            <span>© 2026 SalesIA Enterprise</span>
            <span>Gestión comercial <i /> Analítica empresarial</span>
            <span>Versión 1.0.0</span>
          </footer>
        </div>
      </main>

      {modal && (
        <div className="modal-backdrop" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setModal(null);
        }}>
          <div className={`modal ${modal === 'sale' ? 'sale-modal' : ''}`}>
            <div className="modal-head">
              <div>
                <div className="eyebrow">SALESIA / OPERACIONES</div>
                <h2>{modal === 'sale' ? 'Nueva venta' : modal === 'customer' ? 'Seleccionar cliente' : 'Seleccionar producto'}</h2>
                <p>{modal === 'sale' ? 'Completa los datos de la operación comercial.' : 'Busca y selecciona un registro del catálogo.'}</p>
              </div>
              <button className="icon-btn" onClick={() => setModal(null)}><X size={20} /></button>
            </div>

            {modal === 'sale' ? (
              <>
                <div className="sale-form-scroll">
                  <div className="form-section">
                    <div className="form-section-title"><span className="step-num">1</span><div><b>Datos del documento</b><p>Define el tipo y la fecha de la operación.</p></div></div>
                    <div className="form-grid">
                      <label>Tipo de documento
                        <select value={docType} onChange={(event) => setDocType(event.target.value)}>
                          <option>Factura</option><option>Boleta de venta</option><option>Orden de venta</option><option>Cotización</option>
                        </select>
                      </label>
                      <label>Fecha de emisión<input type="date" defaultValue="2026-10-15" /></label>
                      <label className="wide-field">Vendedor<select defaultValue="Raúl Sandoval"><option>Raúl Sandoval</option><option>Vendedor por asignar</option></select></label>
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="form-section-title"><span className="step-num">2</span><div><b>Cliente</b><p>Busca por RUC, DNI o razón social.</p></div></div>
                    {selectedCustomer ? (
                      <div className="selected-customer">
                        <div className="customer-avatar"><Users size={19} /></div>
                        <div className="selected-customer-info">
                          <b>{selectedCustomer.name}</b>
                          <span>{selectedCustomer.type} · {selectedCustomer.doc}</span>
                          <small>{selectedCustomer.address}</small>
                          <small>{selectedCustomer.email} · {selectedCustomer.phone}</small>
                        </div>
                        <button className="icon-btn" onClick={() => setSelectedCustomer(null)}><X size={17} /></button>
                      </div>
                    ) : (
                      <button className="select-record" onClick={() => { setModal('customer'); setPickSearch(''); }}>
                        <span className="select-plus"><Plus size={18} /></span>
                        <span><b>Seleccionar cliente</b><small>Buscar en el registro de clientes</small></span>
                        <Search size={18} />
                      </button>
                    )}
                  </div>

                  <div className="form-section">
                    <div className="form-section-title"><span className="step-num">3</span><div><b>Productos o servicios</b><p>Añade artículos y ajusta las cantidades.</p></div></div>
                    <button className="select-record add-product-record" onClick={() => { setModal('product'); setPickSearch(''); }}>
                      <span className="select-plus"><Plus size={18} /></span>
                      <span><b>Agregar producto</b><small>Buscar por nombre o código SKU</small></span>
                      <Search size={18} />
                    </button>

                    {cart.length > 0 && (
                      <div className="cart-table">
                        <div className="cart-header"><span>PRODUCTO</span><span>CANT.</span><span>PRECIO</span><span>TOTAL</span><span /></div>
                        {cart.map((item) => (
                          <div className="cart-row" key={item.product.id}>
                            <div className="cart-product"><b>{item.product.name}</b><small>{item.product.sku}</small></div>
                            <div className="qty-control">
                              <button onClick={() => setCart((previous) => previous.map((entry) => entry.product.id === item.product.id ? { ...entry, qty: Math.max(1, entry.qty - 1) } : entry))}>−</button>
                              <span>{item.qty}</span>
                              <button onClick={() => setCart((previous) => previous.map((entry) => entry.product.id === item.product.id ? { ...entry, qty: Math.min(entry.product.stock, entry.qty + 1) } : entry))}>+</button>
                            </div>
                            <span>{money(item.product.price)}</span>
                            <b>{money(item.product.price * item.qty)}</b>
                            <button className="icon-btn remove-btn" onClick={() => setCart((previous) => previous.filter((entry) => entry.product.id !== item.product.id))}><X size={15} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-section">
                    <div className="form-section-title"><span className="step-num">4</span><div><b>Resumen de pago</b><p>Importes calculados automáticamente.</p></div></div>
                    <div className="totals-box">
                      <div><span>Subtotal</span><b>{money(subtotal)}</b></div>
                      <div className="discount-line"><span>Descuento (S/)</span><input type="number" min="0" max={subtotal} value={discount} onChange={(event) => setDiscount(Math.min(subtotal, Math.max(0, Number(event.target.value))))} /></div>
                      <div><span>IGV (18%)</span><b>{money(tax)}</b></div>
                      <div className="total-line"><b>Total de la venta</b><strong>{money(total)}</strong></div>
                      <small>El impuesto y el tipo de documento deben validarse según la configuración tributaria antes de emitir comprobantes oficiales.</small>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <span><ShieldCheck size={15} /> {API_BASE ? 'Conectado al servidor' : 'Modo demostración'}</span>
                  <div>
                    <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancelar</button>
                    <button className="btn btn-primary" onClick={addSale}><Check size={16} /> Registrar venta</button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="picker-search">
                  <Search size={18} />
                  <input autoFocus value={pickSearch} onChange={(event) => setPickSearch(event.target.value)} placeholder={modal === 'customer' ? 'Buscar por RUC, DNI, razón social o nombre...' : 'Buscar por nombre de producto o código SKU...'} />
                  <kbd>ESC</kbd>
                </div>

                <div className="picker-results">
                  {modal === 'customer'
                    ? customers.filter((customer) => (customer.name + customer.doc + customer.email + customer.address).toLowerCase().includes(pickSearch.toLowerCase())).map((customer) => (
                      <button className="picker-item customer-picker" key={customer.id} onClick={() => { setSelectedCustomer(customer); setModal('sale'); }}>
                        <div className="customer-avatar"><Users size={19} /></div>
                        <div className="picker-item-copy"><b>{customer.name}</b><span>{customer.type} · {customer.doc}</span><small>{customer.address}</small><small>{customer.email} · {customer.phone}</small></div>
                        <ChevronRight size={17} />
                      </button>
                    ))
                    : products.filter((product) => (product.name + product.sku + product.category).toLowerCase().includes(pickSearch.toLowerCase())).map((product) => (
                      <button className="picker-item" key={product.id} disabled={product.stock <= 0} onClick={() => addProduct(product)}>
                        <div className="small-product-icon"><Package size={18} /></div>
                        <div className="picker-item-copy"><b>{product.name}</b><span>{product.sku} · {product.category}</span><small>{product.stock} unidades disponibles</small></div>
                        <div className="picker-price"><b>{money(product.price)}</b><span className={product.stock < 8 ? 'stock-low' : ''}>{product.stock < 8 ? 'Stock bajo' : 'Disponible'}</span></div>
                        <Plus size={17} />
                      </button>
                    ))
                  }

                  {((modal === 'customer'
                    ? customers.filter((customer) => (customer.name + customer.doc + customer.email + customer.address).toLowerCase().includes(pickSearch.toLowerCase())).length
                    : products.filter((product) => (product.name + product.sku + product.category).toLowerCase().includes(pickSearch.toLowerCase())).length) === 0) && (
                    <div className="empty-state">
                      <Search size={25} /><b>No se encontraron resultados</b>
                      <span>Prueba con otro nombre, documento o código.</span>
                      <button className="btn btn-secondary" onClick={() => {
                        if (modal === 'customer') {
                          const customer: Customer = {
                            id: Math.max(0, ...customers.map((item) => item.id)) + 1,
                            name: pickSearch.trim() || 'Nuevo cliente',
                            doc: 'Por completar',
                            type: 'Empresa',
                            email: '',
                            phone: '',
                            address: ''
                          };
                          setCustomers((previous) => [...previous, customer]);
                          setSelectedCustomer(customer);
                          setModal('sale');
                        } else {
                          setModal('sale');
                          notify('Completa el catálogo de productos antes de registrar la venta.');
                        }
                      }}>
                        <Plus size={15} /> {modal === 'customer' ? 'Crear cliente de demostración' : 'Volver a la venta'}
                      </button>
                    </div>
                  )}
                </div>

                <div className="modal-footer">
                  <span>{modal === 'customer' ? `${customers.length} clientes registrados` : `${products.length} productos en catálogo`}</span>
                  <button className="btn btn-secondary" onClick={() => setModal('sale')}>Volver a la venta</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {toast && <div className="toast"><Check size={17} />{toast}</div>}
    </div>
  );
}

function median(values: number[]) {
  if (values.length === 0) return 0;

  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle];
}

function Kpi({ icon, label, value, change, note, positive = true }: any) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <div className="kpi-icon">{icon}</div>
        <button className="dots-btn" onClick={() => {}}><MoreHorizontal size={18} /></button>
      </div>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      <div className="kpi-foot">
        <span className={`kpi-change ${positive ? 'up' : 'down'}`}>
          {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {change}
        </span>
        <span>{note}</span>
      </div>
    </div>
  );
}

function Legend({ color, label, value, percent }: any) {
  return (
    <div className="legend-row">
      <span className="legend-name"><i style={{ background: color }} />{label}</span>
      <span className="legend-values"><b>{value}</b><small>{percent}</small></span>
    </div>
  );
}

function SalesTable({
  sales,
  onClick,
  full = false
}: {
  sales: Sale[];
  onClick: () => void;
  full?: boolean;
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr><th>N.º DE VENTA</th><th>CLIENTE</th><th>FECHA</th><th>ESTADO</th><th className="right">IMPORTE TOTAL</th><th /></tr>
        </thead>
        <tbody>
          {sales.map((sale) => (
            <tr key={sale.id} onClick={onClick} className={full ? 'clickable-row' : ''}>
              <td><span className="sale-id">{sale.id}</span></td>
              <td>
                <div className="customer-cell">
                  <div className="table-avatar">{sale.customer.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
                  <div><b>{sale.customer}</b><small>{sale.items} {sale.items === 1 ? 'artículo' : 'artículos'}</small></div>
                </div>
              </td>
              <td className="muted-cell">{sale.date}</td>
              <td>
                <span className={`status ${sale.status === 'Pagada' ? 'status-paid' : sale.status === 'Pendiente' ? 'status-pending' : 'status-cancelled'}`}>
                  <i />{sale.status}
                </span>
              </td>
              <td className="right money-cell">{money(sale.total)}</td>
              <td><button className="dots-btn" onClick={(event) => { event.stopPropagation(); onClick(); }}><MoreHorizontal size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {sales.length === 0 && <div className="empty-table">No hay ventas que coincidan con la búsqueda.</div>}
    </div>
  );
}

function BayesCard({ notify, apiBase }: { notify: (message: string) => void; apiBase: string }) {
  const [prior, setPrior] = useState(30);
  const [likelihood, setLikelihood] = useState(70);
  const [falsePositive, setFalsePositive] = useState(15);
  const [result, setResult] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculate = async () => {
    if (!apiBase) {
      setError('Falta configurar VITE_API_URL con la URL pública de Render.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${apiBase}/probability/bayes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prior,
          likelihood,
          false_positive: falsePositive
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : 'El backend no pudo calcular la probabilidad.'
        );
      }

      const posterior = Number(data.posterior);

      if (!Number.isFinite(posterior) || posterior < 0 || posterior > 100) {
        throw new Error('El backend devolvió un resultado no válido.');
      }

      setResult(posterior);
      notify('Probabilidad calculada por el backend de SalesIA.');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'No se pudo conectar con el servidor de Render.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bayes-layout">
      <section className="panel bayes-form">
        <div className="panel-head">
          <div><h3>Calculadora de Bayes</h3><p>Introduce las probabilidades del escenario comercial.</p></div>
          <div className="bayes-badge"><Calculator size={17} /></div>
        </div>

        <div className="info-note compact">
          <CircleHelp size={17} />
          <div><b>¿Qué vamos a calcular?</b><p>La probabilidad de que ocurra un evento A dado que se ha observado B.</p></div>
        </div>

        <RangeField
          label="Probabilidad previa P(A)"
          value={prior}
          setValue={(value: number) => { setPrior(value); setResult(null); }}
          description="Probabilidad inicial del evento antes de observar la evidencia."
        />
        <RangeField
          label="Probabilidad P(B | A)"
          value={likelihood}
          setValue={(value: number) => { setLikelihood(value); setResult(null); }}
          description="Probabilidad de observar la evidencia si A ocurre."
        />
        <RangeField
          label="Probabilidad P(B | no A)"
          value={falsePositive}
          setValue={(value: number) => { setFalsePositive(value); setResult(null); }}
          description="Probabilidad de observar la evidencia si A no ocurre."
        />

        {error && (
          <div className="info-note compact">
            <AlertCircle size={17} />
            <div><b>No se pudo calcular</b><p>{error}</p></div>
          </div>
        )}

        <button className="btn btn-primary full-btn" onClick={calculate} disabled={loading}>
          <Calculator size={16} /> {loading ? 'Calculando en el servidor...' : 'Calcular con el servidor'}
        </button>
      </section>

      <section className="panel bayes-result">
        <div className="result-top"><div className="result-icon"><Sparkles size={20} /></div><span>RESULTADO DEL ANÁLISIS</span></div>
        <div className="result-number">{result === null ? '—' : result.toFixed(2)}{result !== null && <small>%</small>}</div>
        <h3>Probabilidad posterior P(A | B)</h3>
        <p>{result === null ? 'Introduce los valores y pulsa calcular para consultar el resultado del backend.' : 'Resultado calculado por el servicio estadístico de SalesIA.'}</p>
        <div className="probability-track"><div style={{ width: `${result ?? 0}%` }} /></div>
        <div className="probability-labels"><span>0%</span><b>{result === null ? 'Sin calcular' : `${result.toFixed(2)}%`}</b><span>100%</span></div>
        <div className="formula"><span>Teorema de Bayes</span><b>P(A|B) = P(B|A) × P(A) / P(B)</b></div>
        <div className="result-caveat"><AlertCircle size={16} /><span>El cálculo se ejecuta en Render. Este módulo todavía no guarda un historial de análisis en PostgreSQL.</span></div>
      </section>
    </div>
  );
}

function RangeField({
  label,
  value,
  setValue,
  description
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  description: string;
}) {
  return (
    <div className="range-field">
      <div className="range-title"><label>{label}</label><b>{value}%</b></div>
      <input type="range" min="0" max="100" value={value} onChange={(event) => setValue(Number(event.target.value))} />
      <p>{description}</p>
    </div>
  );
}
