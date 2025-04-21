import { defaultHandlers, toMdast } from 'hast-util-to-mdast';
import { unified } from 'unified';
import parse from 'rehype-parse';
import gridtableHandlers from './hast-to-mdast-gridtable-handlers.js';
import formatPlugin from './mdast-to-md-format-plugin.js';
import remarkGridTable from '@adobe/remark-gridtables';
import stringify from 'remark-stringify';

import {
  imageReferences,
  remarkGfmNoLink,
  sanitizeHeading,
  sanitizeLinks,
  sanitizeTextAndFormats,
  suppressSpaceCode,
} from '@adobe/helix-markdown-support';

function cleanupMarkdown(md) {
  let ret = md;
  if (ret) {
    for (let i = 0; i < 20; i += 1) {
      let x = `${i}`;
      if (i < 10) x = `0${i}`;
      const c = String.fromCodePoint(parseInt(`00${x}`, 16));
      const reg = new RegExp(`\\u00${x}`, 'g');
      const r = [c.length].map(() => ' ').join('');
      ret = ret.replace(reg, r);
    }
    ret = ret.replace(/\u00A0/gm, ' ');
  }
  return ret;
}

export async function createMarkdown(html) {
  const hast = await unified()
    .use(parse, { emitParseErrors: true })
    .parse(html);

  const mdast = toMdast(hast, {
    handlers: {
      ...defaultHandlers,
      u: (state, node) => formatNode('underline', state, node),
      sub: (state, node) => formatNode('subscript', state, node),
      sup: (state, node) => formatNode('superscript', state, node),
      ...gridtableHandlers,
    },
  });

  // cleanup mdast similar to docx2md
  await sanitizeHeading(mdast);
  await sanitizeLinks(mdast);
  await sanitizeTextAndFormats(mdast);
  await suppressSpaceCode(mdast);
  await imageReferences(mdast);

  let md = await unified()
    .use(stringify, {
      strong: '*',
      emphasis: '_',
      bullet: '-',
      fence: '`',
      fences: true,
      incrementListMarker: true,
      rule: '-',
      ruleRepetition: 3,
      ruleSpaces: false,
    })
    .use(remarkGridTable)
    .use(remarkGfmNoLink)
    .use(formatPlugin) // this converts the `underline` and `subscript` back to tags in the md.
    .stringify(mdast);

  // process image links
  // TODO: this can be done easier in the MDAST tree

  // const assets = [];
  // const imgs = document.querySelectorAll('img');
  // imgs.forEach((img) => {
  //   const { src } = img;
  //   const isEmbed = img.classList.contains('hlx-embed');
  //   if (!isEmbed && src && src !== '' && (md.indexOf(src) !== -1 || md.indexOf(decodeURI(src)) !== -1)) {
  //     assets.push({
  //       url: src,
  //       append: '#image.png',
  //     });
  //   }
  // });

  // const as = document.querySelectorAll('a');
  // as.forEach((a) => {
  //   const { href } = a;
  //   try {
  //     if ((href && href !== '' && md.indexOf(href) !== -1) || md.indexOf(decodeURI(href)) !== -1) {
  //       const u = new URL(href);
  //       const ext = path.extname(u.href);
  //       if (ext === '.mp4') {
  //         // upload mp4
  //         assets.push({
  //           url: href,
  //           append: '#image.mp4',
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     this.logger.warn(`Invalid link in the page - ${href}`, error);
  //   }
  // });

  // const vs = document.querySelectorAll('video source');
  // vs.forEach((s) => {
  //   const { src } = s;
  //   if ((src && src !== '' && md.indexOf(src) !== -1) || md.indexOf(decodeURI(src)) !== -1) {
  //     try {
  //       const u = new URL(src);
  //       const ext = path.extname(u.href);
  //       if (ext === '.mp4') {
  //         const poster = s.parentNode.getAttribute('poster');
  //         if (poster) {
  //           assets.push({
  //             url: poster,
  //           });
  //         }
  //         // upload mp4
  //         assets.push({
  //           url: src,
  //           append: '#image.mp4',
  //         });
  //       }
  //     } catch (error) {
  //       this.logger.warn(`Invalid video in the page: ${src}`, error);
  //     }
  //   }
  // });

  // adjust assets url (from relative to absolute)
  // assets.forEach((asset) => {
  //   const u = new URL(decodeURI(asset.url), url);
  //   md = MDUtils.replaceSrcInMarkdown(md, asset.url, u.toString());
  // });

  // if (resource.prepend) {
  //   md = resource.prepend + md;
  // }

  md = cleanupMarkdown(md);

  return {
    content: md,
  };
}