export type HightLightType = 'Contains' | 'StartsWith' | 'EndsWith';
/**
 * Function helps to find which highlightSearch is to call based on your data.
 * @param  {HTMLElement} content - Specifies an content element.
 * @param  {string} query - Specifies the string to be highlighted.
 * @param  {boolean} ignoreCase - Specifies the ignoreCase option.
 * @param  {HightLightType} type - Specifies the type of highlight.
 */
export function highlightSearch(content: HTMLElement, query: string, ignoreCase: boolean, type?: HightLightType): void {
  revert(content);
  if (query === '') {
    return;
  } else {
    let ignoreRegex: string = ignoreCase ? 'gim' : 'gm';
    query = /^[a-zA-Z0-9- ]*$/.test(query) ? query : query.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
    let replaceQuery: string = type === 'StartsWith' ? '^(' + query + ')' : type === 'EndsWith' ? '(' + query + ')$' : '(' + query + ')';
    let pattern: RegExp = new RegExp(replaceQuery, ignoreRegex);
    let li: NodeListOf<Element> = content.querySelectorAll('ul li');
    for (let i: number = 0; i < li.length; i++) {
      let element: Element = li[i];
      element.innerHTML = element.innerHTML.replace(pattern, '<span class="e-highlight">$1</span>');
    }
  }
}

/**
 * Function helps to remove highlighted element based on your data.
 * @param  {HTMLElement} id - Specifies an id of list data.
 */
function revert(content: HTMLElement): void {
  let contentElement: NodeListOf<Element> = content.querySelectorAll('.e-highlight');
  for (let i: number = contentElement.length - 1; i >= 0; i--) {
    let parent: Node = contentElement[i].parentNode;
    let text: Text = document.createTextNode(contentElement[i].textContent);
    parent.replaceChild(text, contentElement[i]);
  }
}