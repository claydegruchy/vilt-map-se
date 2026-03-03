/**
 * dataService.js
 *
 * Handles all data loading. Adjust the paths at the top to match your setup.
 *
 * Expected file structure:
 *   SPECIES_URL  — array of { id, name, speciesGroupId, enableForKill, ... }
 *   REGIONS_URL  — array of { id, name }
 *   DATA_BASE_URL/{regionId}_{speciesId}.json
 *     — { labels: string[], dataSets: [{ label, data: number[] }], ... }
 */

const SPECIES_URL = './species.json';
const REGIONS_URL = './regions.json';
const DATA_BASE_URL = './raw_data';

// ---------------------------------------------------------------------------
// Load reference data
// ---------------------------------------------------------------------------

/** @type {Promise<Array>} */
export const speciesPromise = fetch(SPECIES_URL).then(r => r.json());

/** @type {Promise<Array>} */
export const regionsPromise = fetch(REGIONS_URL).then(r => r.json());

// ---------------------------------------------------------------------------
// Timeseries cache: `${regionId}_${speciesId}` -> { labels, data } | null
// null means we tried and got a 404
// ---------------------------------------------------------------------------

const cache = new Map();

/**
 * Fetch the timeseries for one region+species pair.
 * Returns { labels: string[], data: number[] } or null if not found.
 */
export async function fetchTimeseries(regionId, speciesId) {
	const key = `${regionId}_${speciesId}`;
	if (cache.has(key)) return cache.get(key);

	try {
		const res = await fetch(`${DATA_BASE_URL}/${key}.json`);
		if (!res.ok) {
			cache.set(key, null);
			return null;
		}
		const json = await res.json();
		const result = {
			labels: json.labels,
			data: json.dataSets[0]?.data ?? [],
		};
		cache.set(key, result);
		return result;
	} catch {
		cache.set(key, null);
		return null;
	}
}

/**
 * Fetch all regions for a given species and year.
 * Returns Record<regionId, number> — only regions with data are included.
 *
 * @param {number} speciesId
 * @param {string} year  — must match a label string, e.g. "2021"
 * @param {Array}  regions — from regionsPromise
 */
export async function fetchAllRegionsForYear(speciesId, year, regions) {
	const results = await Promise.all(
		regions.map(async region => {
			const ts = await fetchTimeseries(region.id, speciesId);
			if (!ts) return null;
			const idx = ts.labels.indexOf(String(year));
			if (idx === -1) return null;
			return { regionId: region.id, value: ts.data[idx] ?? 0 };
		})
	);

	return Object.fromEntries(
		results
			.filter(Boolean)
			.map(({ regionId, value }) => [regionId, value])
	);
}


