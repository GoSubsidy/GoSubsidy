GoSubsidy DPR — Step 2: Intelligent Templates

Replace:
1. frontend/src/pages/PremiumDPR.jsx
2. frontend/src/data/dprCategories.js

Add:
3. frontend/src/data/dprTemplateIntelligence.js

The catalog remains the source list. Selecting a project now derives an intelligent
starting profile from project name/source/category and applies:
- project cost
- fixed-asset mix
- working capital
- working-capital margin
- Year-1 sales estimate
- operating expense percentages
- depreciation rate
- business type
- template metadata

All values remain editable by the applicant. This is a starting-assumption engine,
not a claim that the source catalog itself supplies these financial assumptions.
