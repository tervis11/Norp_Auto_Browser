export class HelpFunctions {

    /**
     * Returns a DOM document of search results based on the query
     *
     * @param   {string}                     html_string             The html string to convert to a DOM document
     * @returns {Promise<Document>}                                  The search results as a DOM document
     */
    async html_response_to_dom_document(html_string) {
        const parser = new DOMParser();

        return parser.parseFromString(html_string, "text/html");
    }
}