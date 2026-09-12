import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaChartLine,
  FaUsers,
  FaSearch,
  FaGlobe,
  FaUserCheck,
  FaUserSecret,
  FaExclamationTriangle,
  FaSyncAlt,
  FaFire,
  FaArrowUp,
  FaEye,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";

import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

import { supabase } from "../../lib/supabase";

import "./Analytics.css";


// ============================================================
// DEFAULT DATA
// ============================================================

const EMPTY_ANALYTICS = {
  period_days: 7,

  total_visits: 0,
  unique_sessions: 0,
  unique_users: 0,

  anonymous_sessions: 0,
  logged_in_sessions: 0,

  total_searches: 0,
  unique_searchers: 0,

  anonymous_searches: 0,
  logged_in_searches: 0,

  zero_result_searches: 0,

  top_searches: [],
  trending_searches: [],

  visits_by_day: [],
  searches_by_day: [],

  popular_pages: [],
  search_pages: [],
};


// ============================================================
// FORMAT NUMBER
// ============================================================

function number(value) {
  return new Intl.NumberFormat("en-IN").format(
    Number(value) || 0
  );
}


// ============================================================
// FORMAT DATE
// ============================================================

function formatDay(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}


// ============================================================
// MAIN ANALYTICS PAGE
// ============================================================

export default function Analytics() {
  const [days, setDays] = useState(7);

  const [analytics, setAnalytics] =
    useState(EMPTY_ANALYTICS);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================================
  // LOAD ANALYTICS
  // ==========================================================

  const loadAnalytics = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const {
          data,
          error: rpcError,
        } = await supabase.rpc(
          "get_portal_analytics",
          {
            p_days: days,
          }
        );

        if (rpcError) {
          throw rpcError;
        }

        setAnalytics({
          ...EMPTY_ANALYTICS,
          ...(data || {}),
        });
      } catch (err) {
        console.error(
          "[Analytics] Load error:",
          err
        );

        setError(
          err?.message ||
            "Unable to load portal analytics."
        );
      } finally {
        setLoading(false);
      }
    },
    [days]
  );


  // ==========================================================
  // LOAD WHEN FILTER CHANGES
  // ==========================================================

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);


  // ==========================================================
  // SEARCH ZERO RESULT %
  // ==========================================================

  const zeroResultRate = useMemo(() => {
    if (!analytics.total_searches) {
      return 0;
    }

    return Math.round(
      (
        analytics.zero_result_searches /
        analytics.total_searches
      ) *
        100
    );
  }, [
    analytics.total_searches,
    analytics.zero_result_searches,
  ]);


  // ==========================================================
  // SEARCH / VISIT MAX VALUE
  // ==========================================================

  const maxTraffic = useMemo(() => {
    const visitValues =
      analytics.visits_by_day?.map(
        (item) => Number(item.visits) || 0
      ) || [];

    const searchValues =
      analytics.searches_by_day?.map(
        (item) => Number(item.searches) || 0
      ) || [];

    return Math.max(
      1,
      ...visitValues,
      ...searchValues
    );
  }, [
    analytics.visits_by_day,
    analytics.searches_by_day,
  ]);


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Layout>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="analytics-header">

        <div>
          <PageHeader
            title="Portal Analytics"
            subtitle="Understand how people discover and use GoSubsidy."
          />

          <div className="analytics-live-status">
            <span className="analytics-live-dot" />
            Live Supabase analytics
          </div>
        </div>


        <div className="analytics-actions">

          {/* PERIOD */}

          <div className="analytics-period">

            <FaCalendarAlt />

            <select
              value={days}
              onChange={(event) =>
                setDays(
                  Number(event.target.value)
                )
              }
            >
              <option value={1}>
                Today
              </option>

              <option value={7}>
                Last 7 Days
              </option>

              <option value={30}>
                Last 30 Days
              </option>
            </select>

          </div>


          {/* REFRESH */}

          <button
            type="button"
            className="btn btn-primary"
            onClick={loadAnalytics}
            disabled={loading}
          >

            <FaSyncAlt
              className={
                loading
                  ? "analytics-spin me-2"
                  : "me-2"
              }
            />

            Refresh

          </button>

        </div>

      </div>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="analytics-error">

          <FaExclamationTriangle />

          <div>

            <strong>
              Analytics could not be loaded
            </strong>

            <p>
              {error}
            </p>

            <small>
              If this says "Analytics access denied",
              add your admin user to
              portal_analytics_admins in Supabase.
            </small>

          </div>

        </div>
      )}


      {/* ======================================================
          KPI CARDS
      ====================================================== */}

      <div className="row g-3 mb-4">

        <MetricCard
          icon={<FaSearch />}
          label="Total Searches"
          value={number(
            analytics.total_searches
          )}
          caption={`Last ${days} day${
            days === 1 ? "" : "s"
          }`}
          className="blue"
        />

        <MetricCard
          icon={<FaUsers />}
          label="Unique Searchers"
          value={number(
            analytics.unique_searchers
          )}
          caption="Logged-in users"
          className="purple"
        />

        <MetricCard
          icon={<FaEye />}
          label="Portal Visits"
          value={number(
            analytics.total_visits
          )}
          caption="Tracked page visits"
          className="green"
        />

        <MetricCard
          icon={<FaGlobe />}
          label="Unique Sessions"
          value={number(
            analytics.unique_sessions
          )}
          caption="Browser sessions"
          className="orange"
        />

      </div>


      {/* ======================================================
          USER TYPE CARDS
      ====================================================== */}

      <div className="row g-3 mb-4">

        <MetricCard
          icon={<FaUserCheck />}
          label="Logged-in Searches"
          value={number(
            analytics.logged_in_searches
          )}
          caption="Authenticated users"
          className="cyan"
        />

        <MetricCard
          icon={<FaUserSecret />}
          label="Anonymous Searches"
          value={number(
            analytics.anonymous_searches
          )}
          caption="Visitors without login"
          className="gray"
        />

        <MetricCard
          icon={<FaExclamationTriangle />}
          label="Zero-result Searches"
          value={number(
            analytics.zero_result_searches
          )}
          caption={`${zeroResultRate}% of searches`}
          className="red"
        />

        <MetricCard
          icon={<FaFire />}
          label="Trending Searches"
          value={number(
            analytics.trending_searches?.length
          )}
          caption="Top tracked keywords"
          className="pink"
        />

      </div>


      {/* ======================================================
          TRAFFIC CHART
      ====================================================== */}

      <section className="analytics-card mb-4">

        <div className="analytics-card-header">

          <div>

            <span className="analytics-eyebrow">
              PORTAL ACTIVITY
            </span>

            <h3>
              Searches & Visits
            </h3>

            <p>
              Daily activity during the selected period.
            </p>

          </div>

        </div>


        {loading ? (
          <LoadingBlock />
        ) : (
          <TrafficChart
            visits={analytics.visits_by_day}
            searches={
              analytics.searches_by_day
            }
            maxValue={maxTraffic}
          />
        )}

      </section>


      {/* ======================================================
          SEARCH + TRENDING
      ====================================================== */}

      <div className="row g-4 mb-4">

        {/* TOP SEARCHES */}

        <div className="col-xl-7">

          <section className="analytics-card h-100">

            <div className="analytics-card-header">

              <div>

                <span className="analytics-eyebrow">
                  SEARCH INTELLIGENCE
                </span>

                <h3>
                  Most Searched Keywords
                </h3>

                <p>
                  What users are actively looking for.
                </p>

              </div>

              <FaSearch />

            </div>


            <SearchTable
              rows={analytics.top_searches}
            />

          </section>

        </div>


        {/* TRENDING */}

        <div className="col-xl-5">

          <section className="analytics-card h-100">

            <div className="analytics-card-header">

              <div>

                <span className="analytics-eyebrow">
                  TRENDING
                </span>

                <h3>
                  🔥 Trending Now
                </h3>

              </div>

              <FaFire />

            </div>


            <TrendingList
              rows={
                analytics.trending_searches
              }
            />

          </section>

        </div>

      </div>


      {/* ======================================================
          ZERO RESULT + PAGE ANALYTICS
      ====================================================== */}

      <div className="row g-4 mb-4">

        {/* ZERO RESULT */}

        <div className="col-xl-6">

          <section className="analytics-card h-100">

            <div className="analytics-card-header">

              <div>

                <span className="analytics-eyebrow">
                  SEARCH QUALITY
                </span>

                <h3>
                  Zero-result searches
                </h3>

                <p>
                  Searches where no matching result was returned.
                </p>

              </div>

              <FaExclamationTriangle />

            </div>


            <div className="zero-result-highlight">

              <strong>
                {number(
                  analytics.zero_result_searches
                )}
              </strong>

              <span>
                searches returned zero results
              </span>

              <div className="zero-result-progress">

                <div
                  style={{
                    width: `${Math.min(
                      100,
                      zeroResultRate
                    )}%`,
                  }}
                />

              </div>

              <small>
                {zeroResultRate}% of all searches
              </small>

            </div>


            <SearchTable
              rows={
                analytics.top_searches
                  ?.filter(
                    (item) =>
                      Number(
                        item.zero_results
                      ) > 0
                  )
                  .slice(0, 5)
              }
              zeroResults
            />

          </section>

        </div>


        {/* POPULAR PAGES */}

        <div className="col-xl-6">

          <section className="analytics-card h-100">

            <div className="analytics-card-header">

              <div>

                <span className="analytics-eyebrow">
                  PORTAL NAVIGATION
                </span>

                <h3>
                  Most Visited Pages
                </h3>

                <p>
                  Where users spend their time.
                </p>

              </div>

              <FaMapMarkerAlt />

            </div>


            <PageList
              rows={
                analytics.popular_pages
              }
            />

          </section>

        </div>

      </div>


      {/* ======================================================
          SEARCHES BY PAGE
      ====================================================== */}

      <section className="analytics-card mb-4">

        <div className="analytics-card-header">

          <div>

            <span className="analytics-eyebrow">
              SEARCH BEHAVIOUR
            </span>

            <h3>
              Search Activity by Page
            </h3>

            <p>
              Which GoSubsidy pages generate the most searches.
            </p>

          </div>

        </div>


        <PageList
          rows={
            analytics.search_pages
          }
          metricLabel="searches"
        />

      </section>


      {/* ======================================================
          USER MIX
      ====================================================== */}

      <section className="analytics-card mb-4">

        <div className="analytics-card-header">

          <div>

            <span className="analytics-eyebrow">
              AUDIENCE
            </span>

            <h3>
              Logged-in vs Anonymous
            </h3>

          </div>

        </div>


        <div className="audience-grid">

          <AudienceCard
            icon={<FaUserCheck />}
            title="Logged-in"
            value={
              analytics.logged_in_sessions
            }
            total={
              analytics.unique_sessions
            }
            description="Authenticated browser sessions"
          />

          <AudienceCard
            icon={<FaUserSecret />}
            title="Anonymous"
            value={
              analytics.anonymous_sessions
            }
            total={
              analytics.unique_sessions
            }
            description="Visitors without authentication"
          />

        </div>

      </section>


      {/* ======================================================
          FOOTER INFO
      ====================================================== */}

      <div className="analytics-footer">

        <FaChartLine />

        <span>
          GoSubsidy Analytics ·
          Data from Supabase portal_visits and
          portal_searches
        </span>

      </div>

    </Layout>
  );
}


// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
  icon,
  label,
  value,
  caption,
  className = "",
}) {
  return (
    <div className="col-xl-3 col-md-6">

      <div
        className={`analytics-metric-card ${className}`}
      >

        <div className="analytics-metric-top">

          <div className="analytics-metric-icon">
            {icon}
          </div>

          <FaArrowUp className="analytics-trend-icon" />

        </div>

        <div className="analytics-metric-label">
          {label}
        </div>

        <div className="analytics-metric-value">
          {value}
        </div>

        <div className="analytics-metric-caption">
          {caption}
        </div>

      </div>

    </div>
  );
}


// ============================================================
// TRAFFIC CHART
// ============================================================

function TrafficChart({
  visits = [],
  searches = [],
  maxValue = 1,
}) {
  const rows = useMemo(() => {

    const map = new Map();

    visits.forEach((item) => {

      const key = item.date;

      map.set(key, {
        date: key,
        visits:
          Number(item.visits) || 0,
        searches: 0,
      });

    });

    searches.forEach((item) => {

      const key = item.date;

      const current =
        map.get(key) || {
          date: key,
          visits: 0,
          searches: 0,
        };

      current.searches =
        Number(item.searches) || 0;

      map.set(key, current);

    });

    return Array.from(
      map.values()
    );

  }, [visits, searches]);


  if (!rows.length) {
    return (
      <EmptyState
        icon="bi-bar-chart"
        title="No analytics data yet"
        text="Portal activity will appear here as visitors use GoSubsidy."
      />
    );
  }


  return (
    <div className="traffic-chart">

      <div className="traffic-legend">

        <span>
          <i className="legend-dot visits" />
          Visits
        </span>

        <span>
          <i className="legend-dot searches" />
          Searches
        </span>

      </div>


      <div className="traffic-bars">

        {rows.map((row) => {

          const visitHeight =
            Math.max(
              3,
              (
                row.visits /
                maxValue
              ) * 100
            );

          const searchHeight =
            Math.max(
              3,
              (
                row.searches /
                maxValue
              ) * 100
            );

          return (
            <div
              className="traffic-day"
              key={row.date}
            >

              <div className="traffic-columns">

                <div
                  className="traffic-bar visits"
                  style={{
                    height: `${visitHeight}%`,
                  }}
                  title={`Visits: ${row.visits}`}
                />

                <div
                  className="traffic-bar searches"
                  style={{
                    height: `${searchHeight}%`,
                  }}
                  title={`Searches: ${row.searches}`}
                />

              </div>

              <span>
                {formatDay(row.date)}
              </span>

            </div>
          );

        })}

      </div>

    </div>
  );
}


// ============================================================
// SEARCH TABLE
// ============================================================

function SearchTable({
  rows = [],
  zeroResults = false,
}) {
  if (!rows.length) {
    return (
      <EmptyState
        icon="bi-search"
        title={
          zeroResults
            ? "No zero-result searches"
            : "No searches yet"
        }
        text={
          zeroResults
            ? "Excellent — no zero-result searches were recorded."
            : "Search activity will appear here."
        }
      />
    );
  }


  return (
    <div className="analytics-table-wrap">

      <table className="analytics-table">

        <thead>

          <tr>

            <th>
              Keyword
            </th>

            <th>
              Searches
            </th>

            <th>
              Users
            </th>

            <th>
              Zero Results
            </th>

          </tr>

        </thead>

        <tbody>

          {rows.map(
            (row, index) => (

              <tr
                key={`${row.keyword}-${index}`}
              >

                <td>

                  <div className="keyword-cell">

                    <span className="keyword-rank">
                      {index + 1}
                    </span>

                    <strong>
                      {row.keyword || "Unknown"}
                    </strong>

                  </div>

                </td>

                <td>
                  <strong>
                    {number(row.searches)}
                  </strong>
                </td>

                <td>
                  {number(
                    row.unique_searchers || 0
                  )}
                </td>

                <td>

                  <span
                    className={
                      Number(
                        row.zero_results
                      ) > 0
                        ? "zero-badge"
                        : "success-badge"
                    }
                  >
                    {number(
                      row.zero_results || 0
                    )}
                  </span>

                </td>

              </tr>

            )
          )}

        </tbody>

      </table>

    </div>
  );
}


// ============================================================
// TRENDING LIST
// ============================================================

function TrendingList({
  rows = [],
}) {
  if (!rows.length) {
    return (
      <EmptyState
        icon="bi-fire"
        title="No trends yet"
        text="Trending searches will appear here."
      />
    );
  }


  return (
    <div className="trending-list">

      {rows.map(
        (row, index) => (

          <div
            className="trending-item"
            key={`${row.keyword}-${index}`}
          >

            <div className="trending-rank">
              {index + 1}
            </div>

            <div className="trending-main">

              <strong>
                {row.keyword || "Unknown"}
              </strong>

              <span>
                {number(row.searches)} searches
              </span>

            </div>

            <div className="trending-fire">
              <FaFire />
            </div>

          </div>

        )
      )}

    </div>
  );
}


// ============================================================
// PAGE LIST
// ============================================================

function PageList({
  rows = [],
  metricLabel = "visits",
}) {
  if (!rows.length) {
    return (
      <EmptyState
        icon="bi-window"
        title="No page data yet"
        text="Page activity will appear here."
      />
    );
  }


  const max =
    Math.max(
      1,
      ...rows.map(
        (row) =>
          Number(
            row[metricLabel]
          ) || 0
      )
    );


  return (
    <div className="page-list">

      {rows.map(
        (row, index) => {

          const value =
            Number(
              row[metricLabel]
            ) || 0;

          const width =
            Math.max(
              3,
              (value / max) * 100
            );

          return (
            <div
              className="page-list-item"
              key={`${row.page}-${index}`}
            >

              <div className="page-list-top">

                <span className="page-rank">
                  {index + 1}
                </span>

                <strong>
                  {row.page || "/"}
                </strong>

                <span className="page-value">
                  {number(value)}
                </span>

              </div>

              <div className="page-progress">

                <div
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>

            </div>
          );

        }
      )}

    </div>
  );
}


// ============================================================
// AUDIENCE CARD
// ============================================================

function AudienceCard({
  icon,
  title,
  value,
  total,
  description,
}) {
  const percentage =
    total > 0
      ? Math.round(
          (Number(value) /
            Number(total)) *
            100
        )
      : 0;

  return (
    <div className="audience-card">

      <div className="audience-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {number(value)}
        </strong>

        <small>
          {description}
        </small>

      </div>

      <div className="audience-percentage">
        {percentage}%
      </div>

    </div>
  );
}


// ============================================================
// EMPTY STATE
// ============================================================

function EmptyState({
  icon,
  title,
  text,
}) {
  return (
    <div className="analytics-empty">

      <div className="analytics-empty-icon">
        <i className={`bi ${icon}`} />
      </div>

      <strong>
        {title}
      </strong>

      <span>
        {text}
      </span>

    </div>
  );
}


// ============================================================
// LOADING
// ============================================================

function LoadingBlock() {
  return (
    <div className="analytics-loading">

      <div className="spinner-border text-primary" />

      <strong>
        Loading analytics...
      </strong>

      <span>
        Reading GoSubsidy portal activity.
      </span>

    </div>
  );
}