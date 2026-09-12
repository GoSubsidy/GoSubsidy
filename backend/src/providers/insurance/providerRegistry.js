/* =========================================================
   GOSUBSIDY
   INSURANCE PROVIDER REGISTRY

   Central registry for all approved insurer / insurance
   partner integrations.

   IMPORTANT
   ---------------------------------------------------------
   - Do not place API secrets here.
   - Secrets belong in backend .env.
   - Only registered + enabled providers participate
     in live quote requests.
========================================================= */

const providers = new Map();

/* =========================================================
   REGISTER PROVIDER
========================================================= */

export function registerProvider(provider) {
  if (!provider) {
    throw new Error(
      "Insurance provider is required"
    );
  }

  if (!provider.id) {
    throw new Error(
      "Insurance provider must have an id"
    );
  }

  if (!provider.name) {
    throw new Error(
      `Insurance provider ${provider.id} must have a name`
    );
  }

  if (providers.has(provider.id)) {
    console.warn(
      `[Insurance Registry] Replacing existing provider ${provider.id}`
    );
  }

  providers.set(
    provider.id,
    provider
  );

  console.log(
    `[Insurance Registry] Registered ${provider.name}`
  );

  return provider;
}

/* =========================================================
   UNREGISTER PROVIDER
========================================================= */

export function unregisterProvider(providerId) {
  if (!providerId) {
    return false;
  }

  return providers.delete(providerId);
}

/* =========================================================
   GET SINGLE PROVIDER
========================================================= */

export function getProvider(providerId) {
  if (!providerId) {
    return null;
  }

  return providers.get(providerId) ?? null;
}

/* =========================================================
   GET ALL PROVIDERS
========================================================= */

export function getAllProviders() {
  return Array.from(
    providers.values()
  );
}

/* =========================================================
   GET ENABLED PROVIDERS
========================================================= */

export function getEnabledProviders() {
  return getAllProviders().filter(
    (provider) => {
      try {
        /*
         * Preferred:
         * provider.isEnabled()
         *
         * Fallback:
         * provider.enabled
         */

        if (
          typeof provider.isEnabled === "function"
        ) {
          return provider.isEnabled();
        }

        return provider.enabled === true;
      } catch (error) {
        console.error(
          `[Insurance Registry] Failed checking provider ${provider?.id}:`,
          error
        );

        return false;
      }
    }
  );
}

/* =========================================================
   GET PROVIDERS FOR PRODUCT

   Example:

   getProvidersForProduct("health")

   Returns only enabled providers that support
   the requested insurance product.
========================================================= */

export function getProvidersForProduct(
  insuranceType
) {
  if (!insuranceType) {
    return [];
  }

  const normalizedType =
    String(insuranceType)
      .trim()
      .toLowerCase();

  return getEnabledProviders().filter(
    (provider) => {
      try {
        /*
         * Preferred BaseProvider method
         */

        if (
          typeof provider.supportsProduct ===
          "function"
        ) {
          return provider.supportsProduct(
            normalizedType
          );
        }

        /*
         * Fallback if provider simply exposes
         * supportedProducts array.
         */

        if (
          Array.isArray(
            provider.supportedProducts
          )
        ) {
          return provider.supportedProducts
            .map((product) =>
              String(product)
                .trim()
                .toLowerCase()
            )
            .includes(normalizedType);
        }

        return false;
      } catch (error) {
        console.error(
          `[Insurance Registry] Product check failed for ${provider?.id}:`,
          error
        );

        return false;
      }
    }
  );
}

/* =========================================================
   CHECK PROVIDER EXISTS
========================================================= */

export function hasProvider(providerId) {
  if (!providerId) {
    return false;
  }

  return providers.has(providerId);
}

/* =========================================================
   PROVIDER COUNTS
========================================================= */

export function getProviderCount() {
  return providers.size;
}

export function getEnabledProviderCount() {
  return getEnabledProviders().length;
}

/* =========================================================
   SAFE PROVIDER LIST

   Does NOT intentionally expose:
   - API keys
   - Client secrets
   - Passwords
   - Tokens

   Useful for backend health/status endpoints.
========================================================= */

export function getProviderInfo() {
  return getAllProviders().map(
    (provider) => {
      try {
        /*
         * Preferred method from BaseProvider
         */

        if (
          typeof provider.getInfo ===
          "function"
        ) {
          return provider.getInfo();
        }

        /*
         * Safe fallback
         */

        return {
          id:
            provider.id ?? null,

          name:
            provider.name ??
            "Unknown",

          enabled:
            typeof provider.isEnabled ===
            "function"
              ? provider.isEnabled()
              : provider.enabled === true,

          configured:
            typeof provider.isConfigured ===
            "function"
              ? provider.isConfigured()
              : false,

          supportedProducts:
            Array.isArray(
              provider.supportedProducts
            )
              ? provider.supportedProducts
              : [],
        };
      } catch (error) {
        console.error(
          `[Insurance Registry] Unable to read provider info for ${provider?.id}:`,
          error
        );

        return {
          id:
            provider?.id ?? null,

          name:
            provider?.name ??
            "Unknown",

          enabled: false,

          configured: false,

          supportedProducts: [],
        };
      }
    }
  );
}

/* =========================================================
   REGISTRY STATUS
========================================================= */

export function getRegistryStatus() {
  const all =
    getAllProviders();

  const enabled =
    getEnabledProviders();

  return {
    totalProviders:
      all.length,

    enabledProviders:
      enabled.length,

    disabledProviders:
      all.length -
      enabled.length,

    providers:
      getProviderInfo(),
  };
}

/* =========================================================
   CLEAR REGISTRY

   Mainly useful during development/testing.
   Do not normally call this in production.
========================================================= */

export function clearProviders() {
  providers.clear();

  console.log(
    "[Insurance Registry] Provider registry cleared"
  );
}

/* =========================================================
   DEFAULT EXPORT
========================================================= */

const providerRegistry = {
  registerProvider,

  unregisterProvider,

  getProvider,

  getAllProviders,

  getEnabledProviders,

  getProvidersForProduct,

  hasProvider,

  getProviderCount,

  getEnabledProviderCount,

  getProviderInfo,

  getRegistryStatus,

  clearProviders,
};

export default providerRegistry;