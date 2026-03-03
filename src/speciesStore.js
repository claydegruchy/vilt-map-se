import { writable, get, derived } from 'svelte/store';
import { fetchAllRegionsForYear, fetchTimeseries, regionsPromise, speciesPromise } from './dataService.js';

// ---------------------------------------------------------------------------
// Reference data — resolved once on startup
// ---------------------------------------------------------------------------

export const regions = writable([]);
export const species = writable([]);

Promise.all([regionsPromise, speciesPromise]).then(([r, s]) => {
	regions.set(r);
	species.set(s.filter(sp => sp.enableForKill));
});




export const regionByShortName = writable({});

regionsPromise.then(r => {
	regionByShortName.set(
		Object.fromEntries(r.map(region => [region.name.replace(' län', '').trim().toLowerCase(), region]))
	);
});



// ---------------------------------------------------------------------------
// Selection state
// ---------------------------------------------------------------------------

export const activeSpeciesId = writable(null);
export const activeYear = writable(null);
export const availableYears = writable([]);
export const activeCountyData = writable({});
export const isLoading = writable(false);

// Initialise species selection once loaded
species.subscribe($species => {
	if ($species.length && get(activeSpeciesId) === null) {
		activeSpeciesId.set($species[0].id);
	}
});


export const activeTotalHunted = derived(activeCountyData, $data =>
	Object.values($data).reduce((sum, d) => sum + (d.value ?? 0), 0)
);

// ---------------------------------------------------------------------------
// When species changes, find available years from first responding region
// ---------------------------------------------------------------------------

let yearsAbortKey = null;

activeSpeciesId.subscribe(async speciesId => {
	if (speciesId === null) return;
	const key = speciesId;
	yearsAbortKey = key;

	for (const region of get(regions)) {
		if (yearsAbortKey !== key) return;
		const ts = await fetchTimeseries(region.id, speciesId);
		if (ts?.labels?.length) {
			availableYears.set(ts.labels);
			const current = get(activeYear);
			if (!current || !ts.labels.includes(current)) {
				activeYear.set(ts.labels[ts.labels.length - 1]);
			}
			return;
		}
	}
	availableYears.set([]);
});

// ---------------------------------------------------------------------------
// Reload map data whenever species or year changes
// ---------------------------------------------------------------------------

let dataAbortKey = null;

async function reloadCountyData() {
	const speciesId = get(activeSpeciesId);
	const year = get(activeYear);
	const $regions = get(regions);
	const $years = get(availableYears);
	if (!speciesId || !year || !$regions.length) return;

	const key = `${speciesId}_${year}`;
	dataAbortKey = key;
	isLoading.set(true);

	const prevYear = $years[$years.indexOf(year) - 1] ?? null;

	const [raw, rawPrev] = await Promise.all([
		fetchAllRegionsForYear(speciesId, year, $regions),
		prevYear ? fetchAllRegionsForYear(speciesId, prevYear, $regions) : Promise.resolve({}),
	]);

	if (dataAbortKey !== key) return;

	activeCountyData.set(
		Object.fromEntries(
			Object.entries(raw).map(([regionId, value]) => [
				regionId,
				{
					label: 'Hunted',
					value,
					prevValue: rawPrev[regionId] ?? null,
				}
			])
		)
	);
	isLoading.set(false);
}
activeSpeciesId.subscribe(reloadCountyData);
activeYear.subscribe(reloadCountyData);
regions.subscribe(reloadCountyData);
