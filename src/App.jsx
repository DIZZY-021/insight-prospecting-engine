import { useEffect, useState } from 'react';
import './App.css';

import {
  LayoutDashboard,
  Search,
  List,
  ChartNoAxesColumn,
  Download,
  Globe,
  Phone,
  Mail,
  Star,
  MapPin,
  ChevronRight,
  Copy,
  MessageSquare,
} from 'lucide-react';

const ICONS = {
  dashboard: LayoutDashboard,
  search: Search,
  results: List,
  stats: ChartNoAxesColumn,
  download: Download,
  website: Globe,
  phone: Phone,
  mail: Mail,
  star: Star,
  pin: MapPin,
  chevron: ChevronRight,
  message: MessageSquare,
  copy: Copy,
};

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

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
  },
  {
    id: 'pesquisa',
    label: 'Pesquisa',
    icon: 'search',
  },
  {
    id: 'resultados',
    label: 'Resultados',
    icon: 'results',
  },
  {
    id: 'estatisticas',
    label: 'Estatísticas',
    icon: 'stats',
  },
  {
    id: 'exportar',
    label: 'Exportar',
    icon: 'download',
  },
];

function Sidebar({ activeView, onNavigate, resultCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">IN</span>

        <div>
          <div className="sidebar-brand-name">
            Insight
          </div>

          <div className="sidebar-brand-sub">
            Prospecting Engine
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`sidebar-nav-item${
              activeView === item.id ? ' is-active' : ''
            }`}
            onClick={() => onNavigate(item.id)}
            type="button"
          >
            <Icon name={item.icon} />

            <span>{item.label}</span>

            {item.id === 'resultados' && resultCount > 0 && (
              <span className="sidebar-nav-badge">
                {resultCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-label">
          Fonte de dados
        </div>

        <div className="sidebar-footer-value">
          OpenStreetMap · Overpass API
        </div>
      </div>
    </aside>
  );
}

const OPPORTUNITY_BANDS = [
  {
    key: 'muitoAlta',
    label: 'Muito alta',
    range: '80–100',
    className: 'band-muito-alta',
  },
  {
    key: 'alta',
    label: 'Alta',
    range: '60–79',
    className: 'band-alta',
  },
  {
    key: 'media',
    label: 'Média',
    range: '30–59',
    className: 'band-media',
  },
  {
    key: 'baixa',
    label: 'Baixa',
    range: '0–29',
    className: 'band-baixa',
  },
];

function StatCard({ label, value, hint }) {
  return (
    <div className="stat-card">
      <div className="stat-card-label">
        {label}
      </div>

      <div className="stat-card-value">
        {value}
      </div>

      {hint && (
        <div className="stat-card-hint">
          {hint}
        </div>
      )}
    </div>
  );
}

function DashboardView({
  dashboardStats,
  dashboardLoading,
  dashboardError,
  onGoToSearch,
}) {
  const hasData =
    dashboardStats.totalEmpresas > 0;

  return (
    <div className="view">
      <ViewHeader
        title="Dashboard"
        description="Visão geral das empresas encontradas nas suas pesquisas."
      />

      {dashboardLoading ? (
        <section className="panel">
          <EmptyState
            title="A carregar dashboard..."
            description="A obter os dados guardados no banco de dados."
          />
        </section>
      ) : dashboardError ? (
        <section className="panel">
          <EmptyState
            title="Erro ao carregar dashboard"
            description={dashboardError}
            actionLabel="Ir para Pesquisa"
            onAction={onGoToSearch}
          />
        </section>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard
              label="Empresas encontradas"
              value={dashboardStats.totalEmpresas}
            />

            <StatCard
              label="Alta oportunidade"
              value={dashboardStats.altaOportunidade}
              hint="score ≥ 60"
            />

            <StatCard
              label="Sem website"
              value={dashboardStats.empresasSemWebsite}
            />

            <StatCard
              label="Média Opportunity Score"
              value={
                hasData
                  ? dashboardStats.mediaScore
                  : '—'
              }
              hint="média geral"
            />
          </div>

          <section className="panel">
            <h3 className="panel-title">
              Distribuição por nível de oportunidade
            </h3>

            {hasData ? (
              <div className="band-list">
                {OPPORTUNITY_BANDS.map((band) => (
                  <div
                    className="band-row"
                    key={band.key}
                  >
                    <span
                      className={`band-dot ${band.className}`}
                    />

                    <span className="band-label">
                      {band.label}
                    </span>

                    <span className="band-range">
                      {band.range}
                    </span>

                    <span className="band-count">
                      {dashboardStats[band.key]}
                    </span>
                  </div>
                ))}
              </div>
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
              <section className="panel">
                <h3 className="panel-title">
                  Estatísticas por categoria
                </h3>

                {dashboardStats.estatisticasPorCategoria.length > 0 ? (
                  <div className="band-list">
                    {dashboardStats.estatisticasPorCategoria.map(
                      (item, index) => (
                        <div
                          className="band-row"
                          key={`${item.category}-${index}`}
                        >
                          <span className="band-label">
                            {item.category || 'Não informado'}
                          </span>

                          <span className="band-range">
                            Score médio:{' '}
                            {item.average_score ?? '—'}
                          </span>

                          <span className="band-count">
                            {item.total}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="panel-empty">
                    Nenhuma categoria disponível.
                  </p>
                )}
              </section>

              <section className="panel">
                <h3 className="panel-title">
                  Estatísticas por cidade
                </h3>

                {dashboardStats.estatisticasPorCidade.length > 0 ? (
                  <div className="band-list">
                    {dashboardStats.estatisticasPorCidade.map(
                      (item, index) => (
                        <div
                          className="band-row"
                          key={`${item.city}-${index}`}
                        >
                          <span className="band-label">
                            {item.city || 'Não informado'}
                          </span>

                          <span className="band-range">
                            Score médio:{' '}
                            {item.average_score ?? '—'}
                          </span>

                          <span className="band-count">
                            {item.total}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="panel-empty">
                    Nenhuma cidade disponível.
                  </p>
                )}
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

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

function SearchView({
  form,
  status,
  errorMessage,
  onChange,
  onSubmit,
}) {
  return (
    <div className="view">
      <ViewHeader
        title="Pesquisa"
        description="Encontre empresas e identifique oportunidades digitais."
      />

      <section className="panel">
        <form
          className="search-form"
          onSubmit={onSubmit}
        >
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="country">
                País
              </label>

              <input
                id="country"
                type="text"
                value={form.country}
                onChange={(event) =>
                  onChange(
                    'country',
                    event.target.value
                  )
                }
                placeholder="Ex.: Moçambique"
              />
            </div>

            <div className="form-field">
              <label htmlFor="city">
                Cidade
              </label>

              <input
                id="city"
                type="text"
                value={form.city}
                onChange={(event) =>
                  onChange(
                    'city',
                    event.target.value
                  )
                }
                placeholder="Ex.: Nampula"
              />
            </div>

            <div className="form-field">
              <label htmlFor="businessType">
                Tipo de negócio
              </label>

              <select
                id="businessType"
                value={form.businessType}
                onChange={(event) =>
                  onChange(
                    'businessType',
                    event.target.value
                  )
                }
              >
                <option value="">
                  Seleccione
                </option>

                {BUSINESS_TYPES.map((type) => (
                  <option
                    value={type}
                    key={type}
                  >
                    {type.charAt(0).toUpperCase() +
                      type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="limit">
                Quantidade
              </label>

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
                    event.target.value === ''
                      ? ''
                      : Number(
                          event.target.value
                        )
                  )
                }
                placeholder="Digite a quantidade"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="form-error">
              {errorMessage}
            </div>
          )}

          <div className="search-form-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={status === 'loading'}
            >
              <Icon
                name="search"
                size={17}
              />

              {status === 'loading'
                ? 'A pesquisar...'
                : 'Pesquisar empresas'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DigitalBadge({ label, active }) {
  return (
    <span
      className={`digital-badge${
        active ? ' is-active' : ''
      }`}
    >
      {label}
    </span>
  );
}

function OpportunityPill({
  level,
  score,
}) {
  const normalized = String(
    level || 'Baixa'
  )
    .toLowerCase()
    .replace('é', 'e')
    .replace(/\s/g, '-');

  return (
    <span
      className={`opportunity-pill opportunity-${normalized}`}
    >
      {level || 'Baixa'}

      {Number.isFinite(Number(score))
        ? ` · ${Number(score).toFixed(0)}`
        : ''}
    </span>
  );
}

function BusinessCard({
  business,
  onOpenDetails,
}) {
  const digital =
    business.digitalPresence || {};

  return (
    <article className="business-card">
      <div className="business-card-main">
        <div className="business-card-heading">
          <div>
            <h3 className="business-card-title">
              {business.name}
            </h3>

            <div className="business-card-category">
              {business.category ||
                'Não informado'}
            </div>
          </div>

          <OpportunityPill
            level={
              business.opportunityLevel
            }
            score={
              business.opportunityScore
            }
          />
        </div>

        <div className="business-card-location">
          <Icon
            name="pin"
            size={15}
          />

          <span>
            {business.location ||
              'Localização não encontrada'}
          </span>
        </div>

        <div className="digital-badges">
          <DigitalBadge
            label="Website"
            active={
              digital.hasWebsite ||
              Boolean(business.website)
            }
          />

          <DigitalBadge
            label="Instagram"
            active={
              digital.hasInstagram ||
              Boolean(business.instagram)
            }
          />

          <DigitalBadge
            label="Facebook"
            active={
              digital.hasFacebook ||
              Boolean(business.facebook)
            }
          />

          <DigitalBadge
            label="WhatsApp"
            active={
              digital.hasWhatsapp ||
              Boolean(business.whatsapp)
            }
          />

          <DigitalBadge
            label="Google Maps"
            active={Boolean(
              business.googleMaps
            )}
          />
        </div>

        <div className="business-card-contact">
          {business.phone && (
            <span>
              <Icon
                name="phone"
                size={14}
              />

              {business.phone}
            </span>
          )}

          {business.email && (
            <span>
              <Icon
                name="mail"
                size={14}
              />

              {business.email}
            </span>
          )}

          {business.rating !== null &&
            business.rating !== undefined && (
              <span>
                <Icon
                  name="star"
                  size={14}
                />

                {business.rating}

                {business.reviews
                  ? ` (${business.reviews})`
                  : ''}
              </span>
            )}
        </div>
      </div>

      <button
        className="business-card-action"
        type="button"
        onClick={() =>
          onOpenDetails(business)
        }
      >
        Ver detalhes

        <Icon
          name="chevron"
          size={16}
        />
      </button>
    </article>
  );
}

function ResultsView({
  results,
  onOpenDetails,
}) {
  const [sortBy, setSortBy] =
    useState('score');

  const [filterBy, setFilterBy] =
    useState('todos');

  const processedResults = [...results]
    .filter((business) => {
      if (filterBy === 'todos') {
        return true;
      }

      return (
        String(
          business.opportunityLevel || ''
        ).toLowerCase() ===
        filterBy.toLowerCase()
      );
    })
    .sort((a, b) => {
      if (sortBy === 'score') {
        return (
          Number(
            b.opportunityScore || 0
          ) -
          Number(
            a.opportunityScore || 0
          )
        );
      }

      if (sortBy === 'reviews') {
        return (
          Number(b.reviews || 0) -
          Number(a.reviews || 0)
        );
      }

      if (sortBy === 'rating') {
        return (
          Number(b.rating || 0) -
          Number(a.rating || 0)
        );
      }

      if (sortBy === 'name') {
        return String(
          a.name || ''
        ).localeCompare(
          String(b.name || ''),
          'pt'
        );
      }

      return 0;
    });

  return (
    <div className="view">
      <ViewHeader
        title="Resultados"
        description={`${results.length} empresa${
          results.length === 1
            ? ''
            : 's'
        } encontrada${
          results.length === 1
            ? ''
            : 's'
        }.`}
      />

      {results.length === 0 ? (
        <section className="panel">
          <EmptyState
            title="Nenhum resultado disponível"
            description="Execute uma pesquisa para encontrar empresas."
          />
        </section>
      ) : (
        <>
          <div className="results-toolbar">
            <div className="results-toolbar-group">
              <label htmlFor="sortBy">
                Ordenar por
              </label>

              <select
                id="sortBy"
                value={sortBy}
                onChange={(event) =>
                  setSortBy(
                    event.target.value
                  )
                }
              >
                <option value="score">
                  Opportunity Score
                </option>

                <option value="reviews">
                  Número de avaliações
                </option>

                <option value="rating">
                  Avaliação
                </option>

                <option value="name">
                  Nome
                </option>
              </select>
            </div>

            <div className="results-toolbar-group">
              <label htmlFor="filterBy">
                Filtrar oportunidade
              </label>

              <select
                id="filterBy"
                value={filterBy}
                onChange={(event) =>
                  setFilterBy(
                    event.target.value
                  )
                }
              >
                <option value="todos">
                  Todas
                </option>

                <option value="muito alta">
                  Muito alta
                </option>

                <option value="alta">
                  Alta
                </option>

                <option value="média">
                  Média
                </option>

                <option value="baixa">
                  Baixa
                </option>
              </select>
            </div>
          </div>

          <div className="results-list">
            {processedResults.map(
              (business, index) => (
                <BusinessCard
                  key={
                    business.id ??
                    `${business.name}-${index}`
                  }
                  business={business}
                  onOpenDetails={
                    onOpenDetails
                  }
                />
              )
            )}
          </div>

          {processedResults.length === 0 && (
            <section className="panel">
              <EmptyState
                title="Nenhum resultado corresponde ao filtro"
                description="Altere o nível de oportunidade seleccionado."
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
}) {
  return (
    <div className="detail-row">
      <span className="detail-label">
        {label}
      </span>

      <span className="detail-value">
        {value || 'Não informado'}
      </span>
    </div>
  );
}

function generateProspectMessage(
  business
) {
  const name =
    business.name ||
    'a sua empresa';

  const city =
    business.city || '';

  const problems =
    Array.isArray(
      business.digitalProblems
    )
      ? business.digitalProblems
      : [];

  const services =
    Array.isArray(
      business.recommendedServices
    )
      ? business.recommendedServices
      : [];

  const hasWebsite = Boolean(
    business.website ||
      business.digitalPresence
        ?.hasWebsite
  );

  const hasInstagram = Boolean(
    business.instagram ||
      business.digitalPresence
        ?.hasInstagram
  );

  const hasFacebook = Boolean(
    business.facebook ||
      business.digitalPresence
        ?.hasFacebook
  );

  const hasWhatsapp = Boolean(
    business.whatsapp ||
      business.digitalPresence
        ?.hasWhatsapp
  );

  const serviceText =
    services.length > 0
      ? services
          .slice(0, 2)
          .join(' e ')
      : 'melhorar a presença digital';

  let message = `Olá! Tudo bem? Somos especializados em soluções digitais para empresas e estivemos a analisar a presença online da ${name}`;

  if (city) {
    message += `, em ${city}`;
  }

  message += '.\n\n';

  if (!hasWebsite) {
    message +=
      'Notamos que a empresa não possui um website oficial identificado nas fontes públicas consultadas. ';
  } else if (
    problems.length > 0
  ) {
    message +=
      'Identificámos algumas oportunidades de melhoria na presença digital da empresa. ';
  } else {
    message +=
      'Vimos a presença digital da empresa e identificámos algumas oportunidades que podem ajudar a melhorar a divulgação e o contacto com clientes. ';
  }

  if (
    !hasInstagram &&
    !hasFacebook
  ) {
    message +=
      'Também não encontramos uma presença clara nas principais redes sociais. ';
  } else if (!hasInstagram) {
    message +=
      'Também não encontramos um perfil de Instagram identificado. ';
  } else if (!hasFacebook) {
    message +=
      'Também não encontramos uma página de Facebook identificada. ';
  }

  if (!hasWhatsapp) {
    message +=
      'O WhatsApp também pode ser utilizado como um canal direto de atendimento aos clientes. ';
  }

  message += `\n\nPodemos ajudar com ${serviceText}, criando uma presença digital mais profissional e facilitando o contacto da empresa com os seus clientes.`;

  message +=
    '\n\nSe tiver interesse, podemos apresentar uma proposta sem compromisso.';

  message +=
    '\n\nObrigado!';

  return message;
}

function DetailsView({
  business,
  onBack,
}) {
  const [
    messageCopied,
    setMessageCopied,
  ] = useState(false);

  if (!business) {
    return (
      <div className="view">
        <ViewHeader
          title="Detalhes"
          description="Nenhuma empresa seleccionada."
        />

        <section className="panel">
          <EmptyState
            title="Empresa não seleccionada"
            description="Volte aos resultados para seleccionar uma empresa."
            actionLabel="Voltar aos resultados"
            onAction={onBack}
          />
        </section>
      </div>
    );
  }

  const digital =
    business.digitalPresence || {};

  const website =
    business.websiteAnalysis || {};

  const problems =
    Array.isArray(
      business.digitalProblems
    )
      ? business.digitalProblems
      : [];

  const services =
    Array.isArray(
      business.recommendedServices
    )
      ? business.recommendedServices
      : [];

  const prospectMessage =
    generateProspectMessage(
      business
    );

  async function handleCopyMessage() {
    try {
      await navigator.clipboard.writeText(
        prospectMessage
      );

      setMessageCopied(true);

      setTimeout(() => {
        setMessageCopied(false);
      }, 2000);
    } catch (error) {
      console.error(
        'Erro ao copiar mensagem:',
        error
      );
    }
  }

  return (
    <div className="view">
      <ViewHeader
        title={business.name}
        description={
          business.category ||
          'Detalhes da empresa'
        }
      />

      <div className="details-actions">
        <button
          className="secondary-button"
          type="button"
          onClick={onBack}
        >
          ← Voltar aos resultados
        </button>
      </div>

      <section className="panel">
        <div className="detail-header">
          <div>
            <div className="detail-category">
              {business.category ||
                'Não informado'}
            </div>

            <h2 className="detail-company-name">
              {business.name}
            </h2>

            <div className="business-card-location">
              <Icon
                name="pin"
                size={15}
              />

              <span>
                {business.location ||
                  'Localização não encontrada'}
              </span>
            </div>
          </div>

          <OpportunityPill
            level={
              business.opportunityLevel
            }
            score={
              business.opportunityScore
            }
          />
        </div>
      </section>

      <section className="panel">
        <h3 className="panel-title">
          Presença digital
        </h3>

        <div className="digital-detail-grid">
          <DigitalBadge
            label="Website"
            active={
              digital.hasWebsite ||
              Boolean(business.website)
            }
          />

          <DigitalBadge
            label="Instagram"
            active={
              digital.hasInstagram ||
              Boolean(business.instagram)
            }
          />

          <DigitalBadge
            label="Facebook"
            active={
              digital.hasFacebook ||
              Boolean(business.facebook)
            }
          />

          <DigitalBadge
            label="WhatsApp"
            active={
              digital.hasWhatsapp ||
              Boolean(business.whatsapp)
            }
          />

          <DigitalBadge
            label="Google Maps"
            active={Boolean(
              business.googleMaps
            )}
          />
        </div>
      </section>

      <section className="panel">
        <h3 className="panel-title">
          Contactos e informações
        </h3>

        <div className="details-list">
          <DetailRow
            label="Telefone"
            value={business.phone}
          />

          <DetailRow
            label="Email"
            value={business.email}
          />

          <DetailRow
            label="Website"
            value={business.website}
          />

          <DetailRow
            label="Instagram"
            value={business.instagram}
          />

          <DetailRow
            label="Facebook"
            value={business.facebook}
          />

          <DetailRow
            label="WhatsApp"
            value={business.whatsapp}
          />

          <DetailRow
            label="Avaliação"
            value={
              business.rating !== null &&
              business.rating !== undefined
                ? `${business.rating}${
                    business.reviews
                      ? ` (${business.reviews} avaliações)`
                      : ''
                  }`
                : null
            }
          />

          <DetailRow
            label="Horário"
            value={
              business.openingHours
            }
          />
        </div>
      </section>

      {business.website && (
        <section className="panel">
          <h3 className="panel-title">
            Análise do website
          </h3>

          <div className="details-list">
            <DetailRow
              label="Acessível"
              value={
                website.accessible === true
                  ? 'Sim'
                  : website.accessible === false
                    ? 'Não'
                    : 'Não analisado'
              }
            />

            <DetailRow
              label="HTTPS"
              value={
                website.https === true
                  ? 'Sim'
                  : website.https === false
                    ? 'Não'
                    : 'Não analisado'
              }
            />

            <DetailRow
              label="Adaptação mobile"
              value={
                website.mobileFriendlySignal ===
                true
                  ? 'Encontrada'
                  : website.mobileFriendlySignal ===
                      false
                    ? 'Não encontrada'
                    : 'Não analisada'
              }
            />
          </div>

          {website.outdatedSignals &&
            website.outdatedSignals.length > 0 && (
              <div className="detail-section">
                <h4>
                  Sinais identificados
                </h4>

                <ul className="detail-list">
                  {website.outdatedSignals.map(
                    (signal) => (
                      <li key={signal}>
                        {signal}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
        </section>
      )}

      <section className="panel">
        <h3 className="panel-title">
          Problemas digitais identificados
        </h3>

        {problems.length > 0 ? (
          <ul className="detail-list">
            {problems.map(
              (problem) => (
                <li key={problem}>
                  {problem}
                </li>
              )
            )}
          </ul>
        ) : (
          <p className="panel-empty">
            Nenhum problema digital
            identificado nas fontes
            consultadas.
          </p>
        )}
      </section>

      <section className="panel">
        <h3 className="panel-title">
          Serviços recomendados
        </h3>

        {services.length > 0 ? (
          <ul className="detail-list">
            {services.map(
              (service) => (
                <li key={service}>
                  {service}
                </li>
              )
            )}
          </ul>
        ) : (
          <p className="panel-empty">
            Nenhum serviço recomendado.
          </p>
        )}
      </section>

      {business.opportunitySummary && (
        <section className="panel">
          <h3 className="panel-title">
            Resumo da oportunidade
          </h3>

          <p className="opportunity-summary">
            {
              business.opportunitySummary
            }
          </p>
        </section>
      )}

      <section className="panel">
        <h3 className="panel-title">
          <Icon
            name="message"
            size={18}
          />

          Mensagem de abordagem
        </h3>

        <p className="panel-description">
          Mensagem gerada com base nos
          dados e oportunidades
          identificadas para esta empresa.
        </p>

        <textarea
          className="message-textarea"
          value={prospectMessage}
          readOnly
          rows={12}
        />

        <div className="details-actions">
          <button
            className="primary-button"
            type="button"
            onClick={
              handleCopyMessage
            }
          >
            <Icon
              name="copy"
              size={17}
            />

            {messageCopied
              ? 'Mensagem copiada!'
              : 'Copiar mensagem'}
          </button>
        </div>
      </section>

      <section className="panel">
        <h3 className="panel-title">
          Outras informações públicas
        </h3>

        <div className="details-list">
          <DetailRow
            label="Marca"
            value={business.brand}
          />

          <DetailRow
            label="Operador"
            value={
              business.operator
            }
          />

          <DetailRow
            label="Descrição"
            value={
              business.description
            }
          />

          <DetailRow
            label="Cozinha"
            value={
              business.cuisine
            }
          />

          <DetailRow
            label="Acessibilidade"
            value={
              business.wheelchair
            }
          />

          <DetailRow
            label="Formas de pagamento"
            value={
              business.paymentMethods
            }
          />

          <DetailRow
            label="Fonte"
            value={business.source}
          />
        </div>
      </section>

      <section className="panel">
        <h3 className="panel-title">
          Links públicos
        </h3>

        <div className="detail-links">
          {business.googleMaps && (
            <a
              href={
                business.googleMaps
              }
              target="_blank"
              rel="noreferrer"
            >
              Abrir Google Maps
            </a>
          )}

          {business.osmUrl && (
            <a
              href={business.osmUrl}
              target="_blank"
              rel="noreferrer"
            >
              Abrir OpenStreetMap
            </a>
          )}

          {business.website && (
            <a
              href={business.website}
              target="_blank"
              rel="noreferrer"
            >
              Abrir website
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

function StatisticsView({
  stats,
  onGoToSearch,
}) {
  const hasData =
    stats.totalEmpresas > 0;

  return (
    <div className="view">
      <ViewHeader
        title="Estatísticas"
        description="Análise dos resultados da pesquisa actual."
      />

      {!hasData ? (
        <section className="panel">
          <EmptyState
            title="Ainda sem dados"
            description="Execute uma pesquisa para gerar estatísticas."
            actionLabel="Ir para Pesquisa"
            onAction={onGoToSearch}
          />
        </section>
      ) : (
        <>
          <div className="stat-grid">
            <StatCard
              label="Empresas encontradas"
              value={
                stats.totalEmpresas
              }
            />

            <StatCard
              label="Alta oportunidade"
              value={
                stats.altaOportunidade
              }
              hint="score ≥ 60"
            />

            <StatCard
              label="Sem website"
              value={
                stats.empresasSemWebsite
              }
            />

            <StatCard
              label="Com website"
              value={
                stats.empresasComWebsite
              }
            />

            <StatCard
              label="Presença digital baixa"
              value={
                stats.presencaDigitalBaixa
              }
            />

            <StatCard
              label="Média de avaliação"
              value={
                stats.mediaAvaliacao
              }
            />
          </div>

          <section className="panel">
            <h3 className="panel-title">
              Distribuição por nível de oportunidade
            </h3>

            <div className="band-list">
              {OPPORTUNITY_BANDS.map(
                (band) => (
                  <div
                    className="band-row"
                    key={band.key}
                  >
                    <span
                      className={`band-dot ${band.className}`}
                    />

                    <span className="band-label">
                      {band.label}
                    </span>

                    <span className="band-range">
                      {band.range}
                    </span>

                    <span className="band-count">
                      {stats[band.key]}
                    </span>
                  </div>
                )
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function ExportView({
  allResultsForExport,
  exportCount,
  onExport,
}) {
  return (
    <div className="view">
      <ViewHeader
        title="Exportar"
        description="Exporte todos os resultados das pesquisas em formato CSV."
      />

      <section className="panel">
        <div className="export-content">
          <div>
            <h3 className="panel-title">
              Exportar resultados
            </h3>

            <p className="panel-description">
              {exportCount} empresa
              {exportCount === 1
                ? ''
                : 's'} disponível
              {exportCount === 1
                ? ''
                : 'eis'} para
              exportação.
            </p>
          </div>

          <button
            className="primary-button"
            type="button"
            onClick={onExport}
            disabled={
              !allResultsForExport ||
              allResultsForExport.length === 0
            }
          >
            <Icon
              name="download"
              size={17}
            />

            Exportar CSV
          </button>
        </div>
      </section>
    </div>
  );
}

function ViewHeader({
  title,
  description,
}) {
  return (
    <div className="view-header">
      <div>
        <h1 className="view-title">
          {title}
        </h1>

        <p className="view-description">
          {description}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      <h3 className="empty-state-title">
        {title}
      </h3>

      <p className="empty-state-description">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          className="secondary-button"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

const EMPTY_STATS = {
  totalEmpresas: 0,
  altaOportunidade: 0,
  empresasSemWebsite: 0,
  empresasComWebsite: 0,
  presencaDigitalBaixa: 0,
  semRedesSociais: 0,
  mediaAvaliacao: 0,
  muitoAlta: 0,
  alta: 0,
  media: 0,
  baixa: 0,
};

function calculateStats(results) {
  if (!Array.isArray(results)) {
    return EMPTY_STATS;
  }

  const total = results.length;

  if (total === 0) {
    return EMPTY_STATS;
  }

  const empresasSemWebsite =
    results.filter(
      (business) =>
        !business.website
    ).length;

  const empresasComWebsite =
    total - empresasSemWebsite;

  const altaOportunidade =
    results.filter(
      (business) =>
        Number(
          business.opportunityScore ||
            0
        ) >= 60
    ).length;

  const presencaDigitalBaixa =
    results.filter(
      (business) =>
        business.digitalPresence
          ?.level === 'Baixa'
    ).length;

  const semRedesSociais =
    results.filter(
      (business) =>
        !business.instagram &&
        !business.facebook &&
        !business.whatsapp
    ).length;

  const ratings = results
    .map((business) =>
      Number(business.rating)
    )
    .filter((rating) =>
      Number.isFinite(rating)
    );

  const mediaAvaliacao =
    ratings.length > 0
      ? (
          ratings.reduce(
            (sum, rating) =>
              sum + rating,
            0
          ) / ratings.length
        ).toFixed(1)
      : 0;

  const muitoAlta =
    results.filter(
      (business) =>
        business.opportunityLevel ===
        'Muito alta'
    ).length;

  const alta =
    results.filter(
      (business) =>
        business.opportunityLevel ===
        'Alta'
    ).length;

  const media =
    results.filter(
      (business) =>
        business.opportunityLevel ===
        'Média'
    ).length;

  const baixa =
    results.filter(
      (business) =>
        business.opportunityLevel ===
        'Baixa'
    ).length;

  return {
    totalEmpresas: total,
    altaOportunidade,
    empresasSemWebsite,
    empresasComWebsite,
    presencaDigitalBaixa,
    semRedesSociais,
    mediaAvaliacao,
    muitoAlta,
    alta,
    media,
    baixa,
  };
}

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

function formatDashboardStats(data) {
  const distribution =
    Array.isArray(
      data.opportunityDistribution
    )
      ? data.opportunityDistribution
      : [];

  function getDistributionValue(
    level
  ) {
    const item =
      distribution.find(
        (entry) =>
          String(
            entry.opportunity_level ||
              ''
          ).toLowerCase() ===
          level.toLowerCase()
      );

    return item
      ? Number(item.total || 0)
      : 0;
  }

  return {
    totalEmpresas:
      Number(
        data.totalBusinesses || 0
      ),

    empresasSemWebsite:
      Number(
        data.businessesWithoutWebsite ||
          0
      ),

    altaOportunidade:
      Number(
        data.highOpportunity || 0
      ),

    mediaScore:
      data.averageScore ?? '0.0',

    muitoAlta:
      getDistributionValue(
        'Muito alta'
      ),

    alta:
      getDistributionValue('Alta'),

    media:
      getDistributionValue('Média'),

    baixa:
      getDistributionValue('Baixa'),

    estatisticasPorCategoria:
      Array.isArray(
        data.statisticsByCategory
      )
        ? data.statisticsByCategory
        : [],

    estatisticasPorCidade:
      Array.isArray(
        data.statisticsByCity
      )
        ? data.statisticsByCity
        : [],
  };
}

export default function App() {
  const [
    activeView,
    setActiveView,
  ] = useState('dashboard');

  const [
    form,
    setForm,
  ] = useState({
    country: '',
    city: '',
    businessType: '',
    limit: 10,
  });

  const [
    status,
    setStatus,
  ] = useState('idle');

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  /*
   * RESULTADOS:
   * Guarda somente a pesquisa mais recente.
   */
  const [
    results,
    setResults,
  ] = useState([]);

  /*
   * EXPORTAÇÃO:
   * Guarda todas as pesquisas feitas nesta sessão.
   */
  const [
    allResultsForExport,
    setAllResultsForExport,
  ] = useState([]);

  const [
    selectedBusiness,
    setSelectedBusiness,
  ] = useState(null);

  const [
    dashboardStats,
    setDashboardStats,
  ] = useState(
    EMPTY_DASHBOARD_STATS
  );

  const [
    dashboardLoading,
    setDashboardLoading,
  ] = useState(true);

  const [
    dashboardError,
    setDashboardError,
  ] = useState('');

  const stats =
    calculateStats(results);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      try {
        const response =
          await fetch(
            'http://localhost:3000/api/dashboard'
          );

        if (!response.ok) {
          throw new Error(
            'Erro ao comunicar com o dashboard.'
          );
        }

        const data =
          await response.json();

        if (!data.success) {
          throw new Error(
            data.message ||
              'Não foi possível carregar o dashboard.'
          );
        }

        if (cancelled) {
          return;
        }

        setDashboardStats(
          formatDashboardStats(data)
        );

        setDashboardError('');
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          'Erro ao carregar dashboard:',
          error
        );

        setDashboardError(
          error.message ||
            'Não foi possível carregar os dados.'
        );
      } finally {
        if (!cancelled) {
          setDashboardLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleFormChange(
    field,
    value
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSearchSubmit(
    event
  ) {
    event.preventDefault();

    setErrorMessage('');

    if (
      !form.country ||
      !form.city ||
      !form.businessType ||
      !form.limit
    ) {
      setErrorMessage(
        'Preencha todos os campos antes de pesquisar.'
      );

      return;
    }

    try {
      setStatus('loading');

      setSelectedBusiness(null);

      const params =
        new URLSearchParams({
          country: form.country,
          city: form.city,
          businessType:
            form.businessType,
          limit: form.limit,
        });

      const response =
        await fetch(
          `http://localhost:3000/api/search?${params.toString()}`
        );

      if (!response.ok) {
        throw new Error(
          'Erro ao comunicar com o servidor.'
        );
      }

      const data =
        await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            'Erro ao pesquisar empresas.'
        );
      }

      const newResults =
        Array.isArray(data.results)
          ? data.results
          : [];

      setStatus('submitted');

      /*
       * RESULTADOS:
       * Substitui pelos resultados da pesquisa atual.
       *
       * Portanto:
       * Pesquisa 1 = 5
       * Pesquisa 2 = 5
       * Resultados mostra somente os 5 da Pesquisa 2.
       */
      setResults(newResults);

      /*
       * EXPORTAÇÃO:
       * Mantém as pesquisas anteriores e adiciona
       * os resultados da pesquisa atual.
       */
      setAllResultsForExport(
        (previousResults) => [
          ...previousResults,
          ...newResults,
        ]
      );

      setSelectedBusiness(null);

      setActiveView('resultados');

      /*
       * Atualiza o Dashboard depois da pesquisa.
       */
      try {
        const dashboardResponse =
          await fetch(
            'http://localhost:3000/api/dashboard'
          );

        if (dashboardResponse.ok) {
          const dashboardData =
            await dashboardResponse.json();

          if (dashboardData.success) {
            setDashboardStats(
              formatDashboardStats(
                dashboardData
              )
            );
          }
        }
      } catch (
        dashboardUpdateError
      ) {
        console.warn(
          'Não foi possível atualizar o dashboard:',
          dashboardUpdateError.message
        );
      }
    } catch (error) {
      console.error(error);

      setStatus('error');

      setErrorMessage(
        error.message ||
          'Não foi possível comunicar com o servidor.'
      );
    }
  }

  function handleOpenDetails(
    business
  ) {
    setSelectedBusiness(business);

    setActiveView('detalhes');
  }

  function escapeCsvValue(value) {
    if (
      value === null ||
      value === undefined
    ) {
      return '';
    }

    return `"${String(value).replace(
      /"/g,
      '""'
    )}"`;
  }

  function handleExportCsv() {
    if (
      allResultsForExport.length ===
      0
    ) {
      return;
    }

    const headers = [
      'Nome',
      'Categoria',
      'Localização',
      'Telefone',
      'Email',
      'Website',
      'Instagram',
      'Facebook',
      'WhatsApp',
      'Google Maps',
      'Avaliação',
      'Avaliações',
      'Opportunity Score',
      'Nível de oportunidade',
      'Problemas digitais',
      'Serviços recomendados',
      'Resumo da oportunidade',
      'Fonte',
    ];

    const rows =
      allResultsForExport.map(
        (business) => [
          business.name,
          business.category,
          business.location,
          business.phone,
          business.email,
          business.website,
          business.instagram,
          business.facebook,
          business.whatsapp,
          business.googleMaps,
          business.rating,
          business.reviews,
          business.opportunityScore,
          business.opportunityLevel,

          Array.isArray(
            business.digitalProblems
          )
            ? business.digitalProblems.join(
                ' | '
              )
            : '',

          Array.isArray(
            business.recommendedServices
          )
            ? business.recommendedServices.join(
                ' | '
              )
            : '',

          business.opportunitySummary,
          business.source,
        ]
      );

    const csv = [
      headers
        .map(escapeCsvValue)
        .join(';'),

      ...rows.map((row) =>
        row
          .map(escapeCsvValue)
          .join(';')
      ),
    ].join('\r\n');

    const blob = new Blob(
      ['\uFEFF' + csv],
      {
        type: 'text/csv;charset=utf-8;',
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement('a');

    link.href = url;

    link.download =
      'insight-prospecting-resultados.csv';

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function handleNavigate(view) {
    setActiveView(view);
  }

  function renderView() {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            dashboardStats={
              dashboardStats
            }
            dashboardLoading={
              dashboardLoading
            }
            dashboardError={
              dashboardError
            }
            onGoToSearch={() =>
              setActiveView(
                'pesquisa'
              )
            }
          />
        );

      case 'pesquisa':
        return (
          <SearchView
            form={form}
            status={status}
            errorMessage={
              errorMessage
            }
            onChange={
              handleFormChange
            }
            onSubmit={
              handleSearchSubmit
            }
          />
        );

      case 'resultados':
        return (
          <ResultsView
            results={results}
            onOpenDetails={
              handleOpenDetails
            }
          />
        );

      case 'detalhes':
        return (
          <DetailsView
            business={
              selectedBusiness
            }
            onBack={() =>
              setActiveView(
                'resultados'
              )
            }
          />
        );

      case 'estatisticas':
        return (
          <StatisticsView
            stats={stats}
            onGoToSearch={() =>
              setActiveView(
                'pesquisa'
              )
            }
          />
        );

      case 'exportar':
        return (
          <ExportView
            allResultsForExport={
              allResultsForExport
            }
            exportCount={
              allResultsForExport.length
            }
            onExport={
              handleExportCsv
            }
          />
        );

      default:
        return (
          <DashboardView
            dashboardStats={
              dashboardStats
            }
            dashboardLoading={
              dashboardLoading
            }
            dashboardError={
              dashboardError
            }
            onGoToSearch={() =>
              setActiveView(
                'pesquisa'
              )
            }
          />
        );
    }
  }

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        onNavigate={
          handleNavigate
        }
        resultCount={
          results.length
        }
      />

      <main className="main">
        {renderView()}
      </main>
    </div>
  );
}