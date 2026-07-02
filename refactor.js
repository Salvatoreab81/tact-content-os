const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'onboarding', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Remove STEPS[0]
content = content.replace(
  '{ title: "API & Model Setup", icon: Key },\n  ',
  ''
);

// 2. Remove step === 0 UI block
const step0Regex = /\{\s*step === 0 && \([\s\S]*?\}\s*\)/;
content = content.replace(step0Regex, '');

// 3. Shift steps down
content = content.replace(/step === 1 && \(/g, 'step === 0 && (');
content = content.replace(/step === 2 && \(/g, 'step === 1 && (');
content = content.replace(/step === 3 && \(/g, 'step === 2 && (');
content = content.replace(/step === 4 && \(/g, 'step === 3 && (');
content = content.replace(/step === 5 && \(/g, 'step === 4 && (');
content = content.replace(/step === 6 && \(/g, 'step === 5 && (');

// 4. Update canProceed logic
// Currently: 
// if (step === 0) return !!form.openrouterApiKey;
// if (step === 1) return !!form.name && !!form.industry;
// We need to shift these.
content = content.replace(/if \(step === 0\) return !!form\.openrouterApiKey;\s*/, '');
content = content.replace(/if \(step === 1\) return !!form\.name && !!form\.industry;/g, 'if (step === 0) return !!form.name && !!form.industry;');
content = content.replace(/if \(step === 2\) return true;/g, 'if (step === 1) return true;');
content = content.replace(/if \(step === 3\) return form\.platforms\.length > 0;/g, 'if (step === 2) return form.platforms.length > 0;');
content = content.replace(/if \(step === 4\) return form\.contentVerticals\.length > 0;/g, 'if (step === 3) return form.contentVerticals.length > 0;');
content = content.replace(/if \(step === 5\) return !!form\.toneOfVoice;/g, 'if (step === 4) return !!form.toneOfVoice;');
content = content.replace(/if \(step === 6\) return true;/g, 'if (step === 5) return true;');

// 5. Update disabled={step === 0} for the back button
content = content.replace(/disabled=\{step === 0\}/g, 'disabled={step === 0}');

// 6. Update handleCreateBrand to use localStorage
const createBrandRegex = /const res = await fetch\("\/api\/brands", \{\s*method: "POST",\s*headers: \{ "Content-Type": "application\/json" \},\s*body: JSON\.stringify\(([\s\S]*?)\),\s*\}\);/;

const createBrandReplacement = `
      const setupApiKey = localStorage.getItem("tact_setup_api_key") || "";
      const setupModel = localStorage.getItem("tact_setup_model") || "google/gemini-2.0-flash";
      
      const payload = {
        ...form,
        openrouterApiKey: setupApiKey,
        openrouterModel: setupModel
      };

      const res = await fetch("/api/brands", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
`;
content = content.replace(createBrandRegex, createBrandReplacement.trim());

// 7. Cleanup localStorage after success
content = content.replace(
  'router.push("/dashboard");',
  'localStorage.removeItem("tact_setup_api_key");\n        localStorage.removeItem("tact_setup_model");\n        router.push("/dashboard");'
);

// 8. Update button disabled state in footer
content = content.replace(/step === 2 && form\.targetAudience\.socioEconomic/g, 'step === 1 && form.targetAudience.socioEconomic');
content = content.replace(/step === 6 \? /g, 'step === 5 ? ');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated onboarding/page.tsx');
