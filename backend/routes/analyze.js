const express = require('express');
const router = express.Router();

// Very simple rule-based analyzer and suggestion engine
function analyzeHtml(html){
  const suggestions = [];
  const lower = (html || '').toLowerCase();

  // missing lang attribute
  if(!lower.includes('<html') || !/\<html[^>]*lang\s*=/.test(lower)){
    suggestions.push('Add a language attribute to the <html> tag, e.g. <html lang="en">.');
  }

  // images without alt (basic heuristic)
  const imgNoAlt = (html.match(/<img(?![^>]*alt=)[^>]*>/gi) || []).length;
  if(imgNoAlt>0){
    suggestions.push(`${imgNoAlt} <img> element(s) appear to be missing alt attributes.`);
  }

  // inputs without label
  const inputs = (html.match(/<input|<textarea|<select/gi) || []).length;
  const labeled = (html.match(/<label[\s\S]*?>/gi) || []).length;
  if(inputs > labeled){
    suggestions.push('Some form inputs may be missing associated <label> elements or aria-labels.');
  }

  // heading order check (simple)
  const headings = (html.match(/<h[1-6]/gi) || []).map(h => parseInt(h.replace(/[^0-9]/g,'')));
  const headingIssues = [];
  for(let i=1;i<headings.length;i++){
    if(headings[i] > headings[i-1] + 1){
      headingIssues.push(`Heading jump detected: h${headings[i-1]} → h${headings[i]}`);
    }
  }
  if(headingIssues.length) suggestions.push(...headingIssues);

  // contrast heuristic: check inline styles with color and background hex
  const lowContrastDetails = [];
  const styleMatches = html.match(/style\s*=\s*"([^"]*)"/gi) || [];
  styleMatches.forEach(s => {
    const m = s.match(/color\s*:\s*(#[0-9a-fA-F]{3,6})/i);
    const b = s.match(/background(?:-color)?\s*:\s*(#[0-9a-fA-F]{3,6})/i);
    if(m){
      const fg = m[1];
      const bg = b ? b[1] : '#ffffff';
      if(fg.toLowerCase() === bg.toLowerCase()){
        lowContrastDetails.push(`Style has identical fg/bg ${fg}`);
      }
    }
  });
  if(lowContrastDetails.length){
    suggestions.push(`${lowContrastDetails.length} potential low-contrast issues found in inline styles.`);
  }

  const score = Math.max(10, 100 - suggestions.length * 12);
  return { suggestions, score, summary: `${suggestions.length} suggestions found.` };
}

router.post('/', (req, res) => {
  const { html } = req.body || {};
  if(typeof html !== 'string'){
    return res.status(400).json({ error: 'html string required in body' });
  }
  const result = analyzeHtml(html);
  res.json(result);
});

module.exports = router;
