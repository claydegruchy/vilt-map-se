import { writable, get, derived } from 'svelte/store';
import { fetchAllRegionsForYear, fetchTimeseries, regionsPromise, speciesPromise } from './dataService.js';



export const ALL_SPECIES_ID = 'all';
export const isLoading = writable(true);
// ---------------------------------------------------------------------------
// Reference data — resolved once on startup
// ---------------------------------------------------------------------------

export const regions = writable([]);
export const species = writable([]);
export const regionTop5 = writable({});


Promise.all([regionsPromise, speciesPromise]).then(async ([r, s]) => {
	regions.set(r);
	species.set(s.filter(sp => sp.enableForKill));
	for (const sp of s) {
		const ts = await fetchTimeseries(sp.id, r[0].id);
		if (ts?.labels?.length) {
			availableYears.set(ts.labels);
			activeYear.set(ts.labels[ts.labels.length - 1]);
			break;
		}
	}
	activeSpeciesId.set(ALL_SPECIES_ID); // set last
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


// Initialise species selection once loaded
species.subscribe($species => {
	if (!$species.length) return
	if (get(activeSpeciesId) === null) {
		activeSpeciesId.set(-1);
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
	if (speciesId === null || speciesId === ALL_SPECIES_ID) return;

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



	if (speciesId === ALL_SPECIES_ID) {
		const allRaw = await Promise.all(
			get(species).map(s => fetchAllRegionsForYear(s.id, year, $regions))
		);
		const totals = {};
		for (const raw of allRaw) {
			for (const [regionId, value] of Object.entries(raw)) {
				totals[regionId] = (totals[regionId] ?? 0) + value;
			}
		}


		allSpeciesTotals.set(
			Object.fromEntries(
				get(species).map((s, i) => [
					s.id,
					Object.values(allRaw[i]).reduce((sum, v) => sum + v, 0)
				])
			)
		);

		const top5 = {};
		for (const region of $regions) {
			const id = String(region.id);
			const ranked = get(species)
				.map(s => ({ name: s.name, value: allRaw[get(species).indexOf(s)]?.[id] ?? 0 }))
				.filter(s => s.value > 0)
				.sort((a, b) => b.value - a.value)
				.slice(0, 5);
			top5[id] = ranked;
		}
		regionTop5.set(top5);


		activeCountyData.set(
			Object.fromEntries(
				Object.entries(totals).map(([regionId, value]) => [
					regionId, { label: 'Total', value }
				])
			)
		);
		isLoading.set(false);
		return;
	}



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
					label: 'Total',
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





export const allSpeciesTotals = writable({});

async function reloadAllTotals() {
	const year = get(activeYear);
	const $regions = get(regions);
	const $species = get(species);
	if (!year || !$regions.length || !$species.length) return;

	const entries = await Promise.all(
		$species.map(async s => {
			const raw = await fetchAllRegionsForYear(s.id, year, $regions);
			const total = Object.values(raw).reduce((sum, v) => sum + v, 0);
			return [s.id, total];
		})
	);
	allSpeciesTotals.set(Object.fromEntries(entries));
}

// activeYear.subscribe(reloadAllTotals);
// regions.subscribe(reloadAllTotals);
// species.subscribe(reloadAllTotals);



