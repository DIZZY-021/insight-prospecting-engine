import { useEffect, useState } from 'react';
import './App.css';

import {
  LayoutDashboard,
  Search,
  List,
  ChartNoAxesColumn,
  Download,
  Phone,
  Mail,
  Star,
  MapPin,
  ChevronRight,
  Copy,
  MessageSquare,
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const ICONS = {
  dashboard: LayoutDashboard,
  search: Search,
  results: List,
  stats: ChartNoAxesColumn,
  download: Download,
  phone: Phone,
  mail: Mail,
  star: Star,
  pin: MapPin,
  chevron: ChevronRight,
  message: MessageSquare,
  copy: Copy,
};

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
  { id: 'pesquisa', label: 'Pesquisa', icon: 'search' },
  { id: 'resultados', label: 'Resultados', icon: 'results' },
  { id: 'estatisticas', label: 'Estatísticas', icon: 'stats' },
  { id: 'exportar', label: 'Exportar', icon: 'download' },
];

const OPPORTUNITY_BANDS = [
  { key: 'muitoAlta', label: 'Muito alta', range: '80–100', className: 'band-muito-alta' },
  { key: 'alta', label: 'Alta', range: '60–79', className: 'band-alta' },
  { key: 'media', label: 'Média', range: '30–59', className: 'band-media' },
  { key: 'baixa', label: 'Baixa', range: '0–29', className: 'band-baixa' },
];

const DIGITAL_CHANNELS = [
  { label: 'Website', flag: 'hasWebsite', field: 'website' },
  { label: 'Instagram', flag: 'hasInstagram', field: 'instagram' },
  { label: 'Facebook', flag: 'hasFacebook', field: 'facebook' },
  { label: 'WhatsApp', flag: 'hasWhatsapp', field: 'whatsapp' },
  { label: 'Google Maps', flag: null, field: 'googleMaps' },
];

const BUSINESS_TYPES = [
  'academia',
  'agencia de publicidade',
  'agencia de viagens',
  'aluguer de carros',
  'assistencia tecnica',
  'banco',
  'bar',
  'barbearia',
  'cabeleireiro',
  'cafe',
  'centro de formacao',
  'clinica',
  'consultorio',
  'contabilidade',
  'creche',
  'dentista',
  'empresa de informatica',
  'escola',
  'escritorio de advocacia',
  'estudio',
  'farmacia',
  'florista',
  'fotografia',
  'ginasio',
  'grafica',
  'gelataria',
  'hotel',
  'hotelaria',
  'igreja',
  'imobiliaria',
  'lavagem de carros',
  'lavandaria',
  'livraria',
  'loja',
  'loja de artigos esportivos',
  'loja de calcados',
  'loja de celulares',
  'loja de computadores',
  'loja de cosmeticos',
  'loja de eletrodomesticos',
  'loja de eletronica',
  'loja de ferragens',
  'loja de materiais de construcao',
  'loja de moveis',
  'loja de roupas',
  'loja de conveniencia',
  'mercearia',
  'motocicletas',
  'oficina',
  'optica',
  'padaria',
  'papelaria',
  'pastelaria',
  'peixaria',
  'pet shop',
  'pneus',
  'posto de combustivel',
  'pousada',
  'restaurante',
  'restaurante fast food',
  'relojoaria',
  'salao de festas',
  'seguradora',
  'supermercado',
  'talho',
  'universidade',
  'veterinario',
];

const SORT_OPTIONS = [
  { value: 'score', label: 'Opportunity Score' },
  { value: 'reviews', label: 'Número de avaliações' },
  { value: 'rating', label: 'Avaliação' },
  { value: 'name', label: 'Nome' },
];

const FILTER_OPTIONS = [
  { value: 'todos', label: 'Todas' },
  { value: 'muito alta', label: 'Muito alta' },
  { value: 'alta', label: 'Alta' },
  { value: 'média', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

const SORTERS = {
  score: (a, b) => Number(b.opportunityScore || 0) - Number(a.opportunityScore || 0),
  reviews: (a, b) => Number(b.reviews || 0) - Number(a.reviews || 0),
  rating: (a, b) => Number(b.rating || 0) - Number(a.rating || 0),
  name: (a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'pt'),
};

const STATISTICS_CARDS = [
  { key: 'totalEmpresas', label: 'Empresas encontradas' },
  { key: 'altaOportunidade', label: 'Alta oportunidade', hint: 'score ≥ 60' },
  { key: 'empresasSemWebsite', label: 'Sem website' },
  { key: 'empresasComWebsite', label: 'Com website' },
  { key: 'presencaDigitalBaixa', label: 'Presença digital baixa' },
  { key: 'mediaAvaliacao', label: 'Média de avaliação' },
];

const EMPTY_STATS = {
  totalEmpresas: 0,
  altaOportunidade: 0,
  empresasSemWebsite: 0,
  empresasComWebsite: 0,
  presencaDigitalBaixa: 0,
  mediaAvaliacao: 0,
  muitoAlta: 0,
  alta: 0,
  media: 0,
  baixa: 0,
};

const EMPTY_DASHBOARD_STATS = {
  totalEmpresas: 0,
  empresasSemWebsite: 0,
  altaOportunidade: 0,
  mediaScore: '0.0',
  muitoAlta: 0,
  alta: 0,
  media: 0,
  baixa: 0,
  estatisticasPorCategoria: [],
  estatisticasPorCidade: [],
};

const CSV_COLUMNS = [
  ['Nome', (b) => b.name],
  ['Categoria', (b) => b.category],
  ['Localização', (b) => b.location],
  ['Telefone', (b) => b.phone],
  ['Email', (b) => b.email],
  ['Website', (b) => b.website],
  ['Instagram', (b) => b.instagram],
  ['Facebook', (b) => b.facebook],
  ['WhatsApp', (b) => b.whatsapp],
  ['Google Maps', (b) => b.googleMaps],
  ['Avaliação', (b) => b.rating],
  ['Avaliações', (b) => b.reviews],
  ['Opportunity Score', (b) => b.opportunityScore],
  ['Nível de oportunidade', (b) => b.opportunityLevel],
  ['Problemas digitais', (b) => asArray(b.digitalProblems).join(' | ')],
  ['Serviços recomendados', (b) => asArray(b.recommendedServices).join(' | ')],
  ['Resumo da oportunidade', (b) => b.opportunitySummary],
  ['Fonte', (b) => b.source],
];

function hasValue(value) {
  return value !== null && value !== undefined;
}

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function pluralize(count, one, many) {
  return count === 1 ? one : many;
}

function formatFlag(value, yes, no, unknown) {
  if (value === true) {
    return yes;
  }

  if (value === false) {
    return no;
  }

  return unknown;
}

function hasChannel(business, channel) {
  return Boolean(
    (channel.flag && business.digitalPresence?.[channel.flag]) ||
      business[channel.field]
  );
}

async function fetchApi(path, { httpError, failureError }) {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(httpError);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.message || failureError);
  }

  return data;
}

function fetchDashboard() {
  return fetchApi('/api/dashboard', {
    httpError: 'Erro ao comunicar com o dashboard.',
    failureError: 'Não foi possível carregar o dashboard.',
  });
}

function formatDashboardStats(data) {
  const distribution = asArray(data.opportunityDistribution);

  function countLevel(level) {
    const item = distribution.find(
      (entry) =>
        String(entry.opportunity_level || '').toLowerCase() ===
        level.toLowerCase()
    );

    return Number(item?.total || 0);
  }

  return {
    totalEmpresas: Number(data.totalBusinesses || 0),
    empresasSemWebsite: Number(data.businessesWithoutWebsite || 0),
    altaOportunidade: Number(data.highOpportunity || 0),
    mediaScore: data.averageScore ?? '0.0',
    muitoAlta: countLevel('Muito alta'),
    alta: countLevel('Alta'),
    media: countLevel('Média'),
    baixa: countLevel('Baixa'),
    estatisticasPorCategoria: asArray(data.statisticsByCategory),
    estatisticasPorCidade: asArray(data.statisticsByCity),
  };
}

function calculateStats(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return EMPTY_STATS;
  }

  const total = results.length;
  const count = (predicate) => results.filter(predicate).length;
  const countLevel = (level) =>
    count((business) => business.opportunityLevel === level);

  const empresasSemWebsite = count((business) => !business.website);

  const ratings = results
    .map((business) => Number(business.rating))
    .filter(Number.isFinite);

  const mediaAvaliacao =
    ratings.length > 0
      ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
      : 0;

  return {
    totalEmpresas: total,
    altaOportunidade: count((business) => Number(business.opportunityScore || 0) >= 60),
    empresasSemWebsite,
    empresasComWebsite: total - empresasSemWebsite,
    presencaDigitalBaixa: count((business) => business.digitalPresence?.level === 'Baixa'),
    mediaAvaliacao,
    muitoAlta: countLevel('Muito alta'),
    alta: countLevel('Alta'),
    media: countLevel('Média'),
    baixa: countLevel('Baixa'),
  };
}

function escapeCsvValue(value) {
  if (!hasValue(value)) {
    return '';
  }

  return `"${String(value).replace(/"/g, '""')}"`;
}

function buildCsv(results) {
  const toLine = (values) => values.map(escapeCsvValue).join(';');

  return [
    toLine(CSV_COLUMNS.map(([header]) => header)),
    ...results.map((business) =>
      toLine(CSV_COLUMNS.map(([, getValue]) => getValue(business)))
    ),
  ].join('\r\n');
}

function downloadCsv(csv, filename) {
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function generateProspectMessage(business) {
  const name = business.name || 'a sua empresa';
  const city = business.city ? `, em ${business.city}` : '';
  const problems = asArray(business.digitalProblems);
  const services = asArray(business.recommendedServices);

  const has = Object.fromEntries(
    DIGITAL_CHANNELS.map((channel) => [channel.field, hasChannel(business, channel)])
  );

  const serviceText =
    services.length > 0
      ? services.slice(0, 2).join(' e ')
      : 'melhorar a presença digital';

  const observations = [];

  if (!has.website) {
    observations.push(
      'Notamos que a empresa não possui um website oficial identificado nas fontes públicas consultadas.'
    );
  } else if (problems.length > 0) {
    observations.push(
      'Identificámos algumas oportunidades de melhoria na presença digital da empresa.'
    );
  } else {
    observations.push(
      'Vimos a presença digital da empresa e identificámos algumas oportunidades que podem ajudar a melhorar a divulgação e o contacto com clientes.'
    );
  }

  if (!has.instagram && !has.facebook) {
    observations.push(
      'Também não encontramos uma presença clara nas principais redes sociais.'
    );
  } else if (!has.instagram) {
    observations.push('Também não encontramos um perfil de Instagram identificado.');
  } else if (!has.facebook) {
    observations.push('Também não encontramos uma página de Facebook identificada.');
  }

  if (!has.whatsapp) {
    observations.push(
      'O WhatsApp também pode ser utilizado como um canal direto de atendimento aos clientes.'
    );
  }

  return [
    `Olá! Tudo bem? Somos especializados em soluções digitais para empresas e estivemos a analisar a presença online da ${name}${city}.`,
    observations.join(' '),
    `Podemos ajudar com ${serviceText}, criando uma presença digital mais profissional e facilitando o contacto da empresa com os seus clientes.`,
    'Se tiver interesse, podemos apresentar uma proposta sem compromisso.',
    'Obrigado!',
  ].join('\n\n');
}

function Icon({ name, size = 18 }) {
  const IconComponent = ICONS[name];

  if (!IconComponent) {
    return null;
  }

  return (
    <span className="icon" aria-hidden="true">
      <IconComponent size={size} strokeWidth={2} />
    </span>
  );
}

function ViewHeader({ title, description }) {
  return (
    <div className="view-header">
      <div>
        <h1 className="view-title">{title}</h1>
        <p className="view-description">{description}</p>
      </div>
    </div>
  );
}

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="empty-state">
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-description">{description}</p>

      {actionLabel && onAction && (
        <button className="secondary-button" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

function EmptyPanel(props) {
  return (
    <section className="panel">
      <EmptyState {...props} />
    </section>
  );
}

function Sidebar({ activeView, onNavigate, resultCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">IN</span>

        <div>
          <div className="sidebar-brand-name">Insight</div>
          <div className="sidebar-brand-sub">Prospecting Engine</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item${activeView === item.id ? ' is-active' : ''}`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>

            {item.id === 'resultados' && resultCount > 0 && (
              <span className="sidebar-nav-badge">{resultCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">Fonte de dados</div>
        <div className="sidebar-footer-value">OpenStreetMap · Overpass API</div>
      </div>
    </aside>
  );
}

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{value}</div>
      {hint && <div className="stat-card-hint">{hint}</div>}
    </div>
  );
}

function OpportunityDistribution({ stats }) {
  return (
    <div className="band-list">
      {OPPORTUNITY_BANDS.map((band) => (
        <div className="band-row" key={band.key}>
          <span className={`band-dot ${band.className}`} />
          <span className="band-label">{band.label}</span>
          <span className="band-range">{band.range}</span>
          <span className="band-count">{stats[band.key]}</span>
        </div>
      ))}
    </div>
  );
}

function GroupStats({ title, items, labelKey, emptyText }) {
  return (
    <section className="panel">
      <h3 className="panel-title">{title}</h3>

      {items.length > 0 ? (
        <div className="band-list">
          {items.map((item, index) => (
            <div className="band-row" key={`${item[labelKey]}-${index}`}>
              <span className="band-label">{item[labelKey] || 'Não informado'}</span>
              <span className="band-range">Score médio: {item.average_score ?? '—'}</span>
              <span className="band-count">{item.total}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="panel-empty">{emptyText}</p>
      )}
    </section>
  );
}

function DigitalBadge({ label, active }) {
  return <span className={`digital-badge${active ? ' is-active' : ''}`}>{label}</span>;
}

function DigitalBadges({ business, className }) {
  return (
    <div className={className}>
      {DIGITAL_CHANNELS.map((channel) => (
        <DigitalBadge
          key={channel.label}
          label={channel.label}
          active={hasChannel(business, channel)}
        />
      ))}
    </div>
  );
}

function OpportunityPill({ level, score }) {
  const normalized = String(level || 'Baixa')
    .toLowerCase()
    .replace('é', 'e')
    .replace(/\s/g, '-');

  return (
    <span className={`opportunity-pill opportunity-${normalized}`}>
      {level || 'Baixa'}
      {Number.isFinite(Number(score)) ? ` · ${Number(score).toFixed(0)}` : ''}
    </span>
  );
}

function Location({ location }) {
  return (
    <div className="business-card-location">
      <Icon name="pin" size={15} />
      <span>{location || 'Localização não encontrada'}</span>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="detail-row">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || 'Não informado'}</span>
    </div>
  );
}

function DetailList({ rows }) {
  return (
    <div className="details-list">
      {rows.map(([label, value]) => (
        <DetailRow key={label} label={label} value={value} />
      ))}
    </div>
  );
}

function ItemList({ items }) {
  return (
    <ul className="detail-list">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

function ListPanel({ title, items, emptyText }) {
  return (
    <section className="panel">
      <h3 className="panel-title">{title}</h3>

      {items.length > 0 ? (
        <ItemList items={items} />
      ) : (
        <p className="panel-empty">{emptyText}</p>
      )}
    </section>
  );
}

function Field({ id, label, children }) {
  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {children}
    </div>
  );
}

function BusinessCard({ business, onOpenDetails }) {
  return (
    <article className="business-card">
      <div className="business-card-main">
        <div className="business-card-heading">
          <div>
            <h3 className="business-card-title">{business.name}</h3>
            <div className="business-card-category">
              {business.category || 'Não informado'}
            </div>
          </div>

          <OpportunityPill
            level={business.opportunityLevel}
            score={business.opportunityScore}
          />
        </div>

        <Location location={business.location} />

        <DigitalBadges business={business} className="digital-badges" />

        <div className="business-card-contact">
          {business.phone && (
            <span>
              <Icon name="phone" size={14} />
              {business.phone}
            </span>
          )}

          {business.email && (
            <span>
              <Icon name="mail" size={14} />
              {business.email}
            </span>
          )}

          {hasValue(business.rating) && (
            <span>
              <Icon name="star" size={14} />
              {business.rating}
              {business.reviews ? ` (${business.reviews})` : ''}
            </span>
          )}
        </div>
      </div>

      <button
        className="business-card-action"
        type="button"
        onClick={() => onOpenDetails(business)}
      >
        Ver detalhes
        <Icon name="chevron" size={16} />
      </button>
    </article>
  );
}

function DashboardView({ stats, loading, error, onGoToSearch }) {
  const hasData = stats.totalEmpresas > 0;

  return (
    <div className="view">
      <ViewHeader
        title="Dashboard"
        description="Visão geral das empresas encontradas nas suas pesquisas."
      />

      {loading ? (
        <EmptyPanel
          title="A carregar dashboard..."
          description="A obter os dados guardados no banco de dados."
        />
      ) : error ? (
        <EmptyPanel
          title="Erro ao carregar dashboard"
          description={error}
          actionLabel="Ir para Pesquisa"
          onAction={onGoToSearch}
        />
      ) : (
        <>
          <div className="stat-grid">
            <StatCard label="Empresas encontradas" value={stats.totalEmpresas} />
            <StatCard
              label="Alta oportunidade"
              value={stats.altaOportunidade}
              hint="score ≥ 60"
            />
            <StatCard label="Sem website" value={stats.empresasSemWebsite} />
            <StatCard
              label="Média Opportunity Score"
              value={hasData ? stats.mediaScore : '—'}
              hint="média geral"
            />
          </div>

          <section className="panel">
            <h3 className="panel-title">Distribuição por nível de oportunidade</h3>

            {hasData ? (
              <OpportunityDistribution stats={stats} />
            ) : (
              <EmptyState
                title="Ainda sem pesquisas realizadas"
                description="Execute uma pesquisa para ver os dados do dashboard."
                actionLabel="Ir para Pesquisa"
                onAction={onGoToSearch}
              />
            )}
          </section>

          {hasData && (
            <>
              <GroupStats
                title="Estatísticas por categoria"
                items={stats.estatisticasPorCategoria}
                labelKey="category"
                emptyText="Nenhuma categoria disponível."
              />

              <GroupStats
                title="Estatísticas por cidade"
                items={stats.estatisticasPorCidade}
                labelKey="city"
                emptyText="Nenhuma cidade disponível."
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

function SearchView({ form, loading, errorMessage, onChange, onSubmit }) {
  return (
    <div className="view">
      <ViewHeader
        title="Pesquisa"
        description="Encontre empresas e identifique oportunidades digitais."
      />

      <section className="panel">
        <form className="search-form" onSubmit={onSubmit}>
          <div className="form-grid">
            <Field id="country" label="País">
              <input
                id="country"
                type="text"
                value={form.country}
                onChange={(event) => onChange('country', event.target.value)}
                placeholder="Ex.: Moçambique"
              />
            </Field>

            <Field id="city" label="Cidade">
              <input
                id="city"
                type="text"
                value={form.city}
                onChange={(event) => onChange('city', event.target.value)}
                placeholder="Ex.: Nampula"
              />
            </Field>

            <Field id="businessType" label="Tipo de negócio">
              <select
                id="businessType"
                value={form.businessType}
                onChange={(event) => onChange('businessType', event.target.value)}
              >
                <option value="">Seleccione</option>

                {BUSINESS_TYPES.map((type) => (
                  <option value={type} key={type}>
                    {capitalize(type)}
                  </option>
                ))}
              </select>
            </Field>

            <Field id="limit" label="Quantidade">
              <input
                id="limit"
                type="number"
                min="1"
                max="100"
                step="1"
                value={form.limit}
                onChange={(event) =>
                  onChange(
                    'limit',
                    event.target.value === '' ? '' : Number(event.target.value)
                  )
                }
                placeholder="Digite a quantidade"
              />
            </Field>
          </div>

          {errorMessage && <div className="form-error">{errorMessage}</div>}

          <div className="search-form-actions">
            <button className="primary-button" type="submit" disabled={loading}>
              <Icon name="search" size={17} />
              {loading ? 'A pesquisar...' : 'Pesquisar empresas'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function ResultsView({ results, onOpenDetails }) {
  const [sortBy, setSortBy] = useState('score');
  const [filterBy, setFilterBy] = useState('todos');

  const processedResults = results
    .filter(
      (business) =>
        filterBy === 'todos' ||
        String(business.opportunityLevel || '').toLowerCase() === filterBy
    )
    .sort(SORTERS[sortBy]);

  return (
    <div className="view">
      <ViewHeader
        title="Resultados"
        description={`${results.length} ${pluralize(
          results.length,
          'empresa encontrada',
          'empresas encontradas'
        )}.`}
      />

      {results.length === 0 ? (
        <EmptyPanel
          title="Nenhum resultado disponível"
          description="Execute uma pesquisa para encontrar empresas."
        />
      ) : (
        <>
          <div className="results-toolbar">
            <div className="results-toolbar-group">
              <label htmlFor="sortBy">Ordenar por</label>

              <select
                id="sortBy"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="results-toolbar-group">
              <label htmlFor="filterBy">Filtrar oportunidade</label>

              <select
                id="filterBy"
                value={filterBy}
                onChange={(event) => setFilterBy(event.target.value)}
              >
                {FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="results-list">
            {processedResults.map((business, index) => (
              <BusinessCard
                key={business.id ?? `${business.name}-${index}`}
                business={business}
                onOpenDetails={onOpenDetails}
              />
            ))}
          </div>

          {processedResults.length === 0 && (
            <EmptyPanel
              title="Nenhum resultado corresponde ao filtro"
              description="Altere o nível de oportunidade seleccionado."
            />
          )}
        </>
      )}
    </div>
  );
}

function DetailsView({ business, onBack }) {
  const [messageCopied, setMessageCopied] = useState(false);

  if (!business) {
    return (
      <div className="view">
        <ViewHeader title="Detalhes" description="Nenhuma empresa seleccionada." />

        <EmptyPanel
          title="Empresa não seleccionada"
          description="Volte aos resultados para seleccionar uma empresa."
          actionLabel="Voltar aos resultados"
          onAction={onBack}
        />
      </div>
    );
  }

  const website = business.websiteAnalysis || {};
  const problems = asArray(business.digitalProblems);
  const services = asArray(business.recommendedServices);
  const outdatedSignals = asArray(website.outdatedSignals);
  const prospectMessage = generateProspectMessage(business);

  const ratingText = hasValue(business.rating)
    ? `${business.rating}${business.reviews ? ` (${business.reviews} avaliações)` : ''}`
    : null;

  const contactRows = [
    ['Telefone', business.phone],
    ['Email', business.email],
    ['Website', business.website],
    ['Instagram', business.instagram],
    ['Facebook', business.facebook],
    ['WhatsApp', business.whatsapp],
    ['Avaliação', ratingText],
    ['Horário', business.openingHours],
  ];

  const websiteRows = [
    ['Acessível', formatFlag(website.accessible, 'Sim', 'Não', 'Não analisado')],
    ['HTTPS', formatFlag(website.https, 'Sim', 'Não', 'Não analisado')],
    [
      'Adaptação mobile',
      formatFlag(website.mobileFriendlySignal, 'Encontrada', 'Não encontrada', 'Não analisada'),
    ],
  ];

  const publicInfoRows = [
    ['Marca', business.brand],
    ['Operador', business.operator],
    ['Descrição', business.description],
    ['Cozinha', business.cuisine],
    ['Acessibilidade', business.wheelchair],
    ['Formas de pagamento', business.paymentMethods],
    ['Fonte', business.source],
  ];

  const publicLinks = [
    ['Abrir Google Maps', business.googleMaps],
    ['Abrir OpenStreetMap', business.osmUrl],
    ['Abrir website', business.website],
  ].filter(([, href]) => href);

  async function handleCopyMessage() {
    try {
      await navigator.clipboard.writeText(prospectMessage);
      setMessageCopied(true);
      setTimeout(() => setMessageCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar mensagem:', error);
    }
  }

  return (
    <div className="view">
      <ViewHeader
        title={business.name}
        description={business.category || 'Detalhes da empresa'}
      />

      <div className="details-actions">
        <button className="secondary-button" type="button" onClick={onBack}>
          ← Voltar aos resultados
        </button>
      </div>

      <section className="panel">
        <div className="detail-header">
          <div>
            <div className="detail-category">
              {business.category || 'Não informado'}
            </div>

            <h2 className="detail-company-name">{business.name}</h2>

            <Location location={business.location} />
          </div>

          <OpportunityPill
            level={business.opportunityLevel}
            score={business.opportunityScore}
          />
        </div>
      </section>

      <section className="panel">
        <h3 className="panel-title">Presença digital</h3>
        <DigitalBadges business={business} className="digital-detail-grid" />
      </section>

      <section className="panel">
        <h3 className="panel-title">Contactos e informações</h3>
        <DetailList rows={contactRows} />
      </section>

      {business.website && (
        <section className="panel">
          <h3 className="panel-title">Análise do website</h3>
          <DetailList rows={websiteRows} />

          {outdatedSignals.length > 0 && (
            <div className="detail-section">
              <h4>Sinais identificados</h4>
              <ItemList items={outdatedSignals} />
            </div>
          )}
        </section>
      )}

      <ListPanel
        title="Problemas digitais identificados"
        items={problems}
        emptyText="Nenhum problema digital identificado nas fontes consultadas."
      />

      <ListPanel
        title="Serviços recomendados"
        items={services}
        emptyText="Nenhum serviço recomendado."
      />

      {business.opportunitySummary && (
        <section className="panel">
          <h3 className="panel-title">Resumo da oportunidade</h3>
          <p className="opportunity-summary">{business.opportunitySummary}</p>
        </section>
      )}

      <section className="panel">
        <h3 className="panel-title">
          <Icon name="message" size={18} />
          Mensagem de abordagem
        </h3>

        <p className="panel-description">
          Mensagem gerada com base nos dados e oportunidades identificadas para esta
          empresa.
        </p>

        <textarea
          className="message-textarea"
          value={prospectMessage}
          readOnly
          rows={12}
        />

        <div className="details-actions">
          <button className="primary-button" type="button" onClick={handleCopyMessage}>
            <Icon name="copy" size={17} />
            {messageCopied ? 'Mensagem copiada!' : 'Copiar mensagem'}
          </button>
        </div>
      </section>

      <section className="panel">
        <h3 className="panel-title">Outras informações públicas</h3>
        <DetailList rows={publicInfoRows} />
      </section>

      <section className="panel">
        <h3 className="panel-title">Links públicos</h3>

        <div className="detail-links">
          {publicLinks.map(([label, href]) => (
            <a key={label} href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatisticsView({ stats, onGoToSearch }) {
  return (
    <div className="view">
      <ViewHeader
        title="Estatísticas"
        description="Análise dos resultados da pesquisa actual."
      />

      {stats.totalEmpresas === 0 ? (
        <EmptyPanel
          title="Ainda sem dados"
          description="Execute uma pesquisa para gerar estatísticas."
          actionLabel="Ir para Pesquisa"
          onAction={onGoToSearch}
        />
      ) : (
        <>
          <div className="stat-grid">
            {STATISTICS_CARDS.map((card) => (
              <StatCard
                key={card.key}
                label={card.label}
                value={stats[card.key]}
                hint={card.hint}
              />
            ))}
          </div>

          <section className="panel">
            <h3 className="panel-title">Distribuição por nível de oportunidade</h3>
            <OpportunityDistribution stats={stats} />
          </section>
        </>
      )}
    </div>
  );
}

function ExportView({ exportCount, onExport }) {
  return (
    <div className="view">
      <ViewHeader
        title="Exportar"
        description="Exporte todos os resultados das pesquisas em formato CSV."
      />

      <section className="panel">
        <div className="export-content">
          <div>
            <h3 className="panel-title">Exportar resultados</h3>

            <p className="panel-description">
              {exportCount}{' '}
              {pluralize(exportCount, 'empresa disponível', 'empresas disponíveis')} para
              exportação.
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={onExport}
            disabled={exportCount === 0}
          >
            <Icon name="download" size={17} />
            Exportar CSV
          </button>
        </div>
      </section>
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [form, setForm] = useState({
    country: '',
    city: '',
    businessType: '',
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [results, setResults] = useState([]);
  const [allResultsForExport, setAllResultsForExport] = useState([]);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(EMPTY_DASHBOARD_STATS);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  const stats = calculateStats(results);

  useEffect(() => {
    let cancelled = false;

    fetchDashboard()
      .then((data) => {
        if (cancelled) {
          return;
        }

        setDashboardStats(formatDashboardStats(data));
        setDashboardError('');
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        console.error('Erro ao carregar dashboard:', error);
        setDashboardError(error.message || 'Não foi possível carregar os dados.');
      })
      .finally(() => {
        if (!cancelled) {
          setDashboardLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshDashboard() {
    try {
      setDashboardStats(formatDashboardStats(await fetchDashboard()));
    } catch (error) {
      console.warn('Não foi possível atualizar o dashboard:', error.message);
    }
  }

  function handleFormChange(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  async function handleSearchSubmit(event) {
    event.preventDefault();
    setErrorMessage('');

    if (!form.country || !form.city || !form.businessType || !form.limit) {
      setErrorMessage('Preencha todos os campos antes de pesquisar.');
      return;
    }

    try {
      setLoading(true);
      setSelectedBusiness(null);

      const params = new URLSearchParams({
        country: form.country,
        city: form.city,
        businessType: form.businessType,
        limit: form.limit,
      });

      const data = await fetchApi(`/api/search?${params}`, {
        httpError: 'Erro ao comunicar com o servidor.',
        failureError: 'Erro ao pesquisar empresas.',
      });

      const newResults = asArray(data.results);

      setResults(newResults);
      setAllResultsForExport((previous) => [...previous, ...newResults]);
      setActiveView('resultados');
      refreshDashboard();
    } catch (error) {
      console.error(error);
      setErrorMessage(error.message || 'Não foi possível comunicar com o servidor.');
    } finally {
      setLoading(false);
    }
  }

  function handleOpenDetails(business) {
    setSelectedBusiness(business);
    setActiveView('detalhes');
  }

  function handleExportCsv() {
    if (allResultsForExport.length === 0) {
      return;
    }

    downloadCsv(
      buildCsv(allResultsForExport),
      'insight-prospecting-resultados.csv'
    );
  }

  function renderView() {
    switch (activeView) {
      case 'pesquisa':
        return (
          <SearchView
            form={form}
            loading={loading}
            errorMessage={errorMessage}
            onChange={handleFormChange}
            onSubmit={handleSearchSubmit}
          />
        );

      case 'resultados':
        return <ResultsView results={results} onOpenDetails={handleOpenDetails} />;

      case 'detalhes':
        return (
          <DetailsView
            business={selectedBusiness}
            onBack={() => setActiveView('resultados')}
          />
        );

      case 'estatisticas':
        return (
          <StatisticsView stats={stats} onGoToSearch={() => setActiveView('pesquisa')} />
        );

      case 'exportar':
        return (
          <ExportView
            exportCount={allResultsForExport.length}
            onExport={handleExportCsv}
          />
        );

      case 'dashboard':
      default:
        return (
          <DashboardView
            stats={dashboardStats}
            loading={dashboardLoading}
            error={dashboardError}
            onGoToSearch={() => setActiveView('pesquisa')}
          />
        );
    }
  }

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        onNavigate={setActiveView}
        resultCount={results.length}
      />

      <main className="main">{renderView()}</main>
    </div>
  );
}