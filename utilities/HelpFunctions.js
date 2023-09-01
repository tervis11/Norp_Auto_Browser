export class HelpFunctions {

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}                     html_string             The html string to convert to a DOM document
     * @returns {Promise<Document>}                                  The search results as a DOM document
     */
    html_response_to_dom_document = async (html_string) => {
        const parser = new DOMParser();

        return parser.parseFromString(html_string, "text/html");
    }

    /**
     * Returns a shuffled array
     */
    shuffle_array = async (array) => {
        let shuffled_array = [...array];

        for (let i = shuffled_array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled_array[i], shuffled_array[j]] = [shuffled_array[j], shuffled_array[i]];
        }

        return shuffled_array;
    }
}