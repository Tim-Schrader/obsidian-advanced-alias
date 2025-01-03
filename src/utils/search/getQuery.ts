type QueryType = {
	file: boolean;
	fileAlias: boolean;
	heading: boolean;
	headingAlias: boolean;
};

type SearchOptions = {
	file: boolean;
	heading: boolean;
	alias: boolean;
};

const validSearchCommands: Record<string, keyof SearchOptions> = {
	"*": "file",
	"#": "heading",
	"@": "alias",
};

export default function getQuery(query: string): {
	queryText: string;
	queryType: QueryType;
	searchOptions: SearchOptions;
} {
	const selectedSearchOptions = {
		file: false,
		heading: false,
		alias: false,
	};
	const validSearchCount = 2;

	for (let i = 1; i <= validSearchCount; i++) {
		const currentSearch = validSearchCommands[query[0]];
		if (currentSearch !== undefined) {
			selectedSearchOptions[currentSearch] = true;
			query = query.slice(1);
		} else {
			break;
		}
	}

	const queryType = {
		file: true,
		fileAlias: true,
		heading: true,
		headingAlias: true,
	};

	if (selectedSearchOptions.file) {
		queryType.heading = false;
		queryType.headingAlias = false;
	}
	if (selectedSearchOptions.heading) {
		queryType.file = false;
		queryType.fileAlias = false;
	}
	if (selectedSearchOptions.alias) {
		queryType.file = false;
		queryType.heading = false;
	}

	return {
		queryText: query,
		queryType,
		searchOptions: selectedSearchOptions,
	};
}
