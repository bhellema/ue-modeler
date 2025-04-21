/* eslint-env mocha */

/* eslint-env mocha */
import { expect } from 'chai';
import { createMarkdown } from '../src/markdown.js';

describe('createMarkdown', () => {
  it('should handle missing values', async () => {
    const html = `<table>
  <tr>
    <th>Hero</th>
  </tr>
  <tr>
    <td>
      <p>
      <h1>Rock’n Roll Plush</h1><img loading="lazy" alt="Hero image" src="https://main--stini--bhellema.aem.live/media_1b50a0b66ff593398f892cc5a375cf708fac7141e.jpeg" width="1600" height="914"></p>
    </td>
  </tr>
</table>`;

    const content = await createMarkdown(html);
    console.log(content);
  }).timeout(100000);
}); 