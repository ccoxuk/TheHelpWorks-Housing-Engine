# Content Packs Guide

This document explains how to create, structure, and use content packs in the Universal Homelessness Support Platform (U-HSP).

## What is a Content Pack?

A content pack is a complete, self-contained bundle of resources for a specific jurisdiction that includes:

- **Questions**: Triage decision tree questions
- **Rules**: Legal and policy-based eligibility rules
- **Actions**: Templates for actions to take
- **Services**: Available local services and resources
- **Workflows**: Pre-defined sequences for common scenarios
- **Legal References**: Links to relevant legislation
- **Resources**: Additional documents, forms, and helplines

Content packs enable the U-HSP to support different regions with different laws, services, and languages.

---

## Why Use Content Packs?

### Localization

Different jurisdictions have:
- Different laws and policies
- Different services available
- Different languages
- Different cultural contexts

Content packs keep all region-specific information organized and maintainable.

### Versioning

Content packs use semantic versioning:
- Track changes over time
- Update when laws change
- Roll back if needed
- Maintain history

### Reusability

- Share content between similar regions
- Build on existing packs
- Create variants for sub-regions
- Maintain consistency

### Governance

- Clear ownership
- Defined update process
- Quality control
- Verification tracking

---

## Content Pack Structure

### Required Fields

```json
{
  "id": "unique-identifier",
  "name": "Human-Readable Name",
  "version": "1.0.0",
  "jurisdiction": "England/Wales"
}
```

### Full Structure

```json
{
  "id": "england-wales-london-rough-sleeping",
  "name": "London Rough Sleeping Content Pack",
  "description": "Comprehensive content pack for London rough sleeping",
  "version": "1.0.0",
  "jurisdiction": "England/Wales",
  "language": "en",
  "supportedLanguages": ["en", "pl", "cy"],
  "effectiveDate": "2025-01-01",
  "expiryDate": null,
  "entryPoint": "q1_homeless_tonight",
  
  "questions": [...],
  "rules": [...],
  "actions": [...],
  "services": [...],
  "workflows": [...],
  "legalReferences": [...],
  "resources": {...},
  "metadata": {...}
}
```

---

## Creating a Content Pack

### Step 1: Define Scope

Determine:
- **Geographic coverage**: City, region, country?
- **Target population**: Rough sleepers, families, young people?
- **Legal framework**: Which laws apply?
- **Language requirements**: Which languages to support?

Example:
```
Scope: London rough sleeping
Population: Single adults sleeping rough
Laws: Housing Act 1996, Homelessness Reduction Act 2017
Languages: English primary, Polish and Welsh secondary
```

### Step 2: Identify Services

Research and catalog:
- Emergency shelters
- Day centers
- Outreach teams
- Helplines
- Medical services
- Support organizations

For each service, gather:
- Contact information
- Location and accessibility
- Hours of operation
- Eligibility criteria
- Capacity information
- Pet policies
- Referral requirements

### Step 3: Map Legal Rules

Identify relevant legislation:
- Homelessness duties
- Priority need criteria
- Eligibility requirements
- Local authority responsibilities

Translate into rules:
```json
{
  "id": "section_188_emergency_duty",
  "name": "Section 188 Emergency Accommodation Duty",
  "legalBasis": "Housing Act 1996 Section 188",
  "conditions": {...},
  "actions": [...]
}
```

### Step 4: Design Question Flow

Create triage decision tree:
1. Safety and urgency questions first
2. Priority need assessment
3. Eligibility determination
4. Service matching

See `/docs/TRIAGE_DECISION_TREES.md` for detailed guidance.

### Step 5: Define Actions

Create action templates for:
- **Immediate actions**: Call helpline, contact outreach
- **Applications**: Housing assessment, benefit claims
- **Referrals**: Specialist services, medical care
- **Documentation**: Forms, evidence gathering

### Step 6: Add Resources

Include:
- Legal documents and guides
- Application forms
- Factsheets
- Helpline numbers
- Useful websites

### Step 7: Test and Validate

- Run through test scenarios
- Verify all references
- Check contact information
- Validate JSON structure
- Test rule logic

---

## Example: London Rough Sleeping Pack

See `/content-packs/london-rough-sleeping.json` for a complete example.

### Services Included

**Emergency Response:**
- StreetLink (24/7 rough sleeper reporting)
- Hope House Pet-Friendly Shelter
- Lambeth Council Emergency Housing

**Support Services:**
- Thames Reach Outreach Team
- Crisis Skylight London (day center)
- Pets in Crisis (temporary fostering)

### Rules Included

**Section 188 Emergency Duty:**
Triggers when:
- Homeless tonight
- Eligible for assistance
- Has priority need (children, pregnant, vulnerable)

**Pet-Friendly Prioritization:**
Triggers when:
- Has pets
- Homeless tonight
- Routes to pet-friendly services

**Rough Sleeping Outreach:**
Triggers when:
- Currently rough sleeping
- Alerts StreetLink and outreach teams

### Actions Included

1. Contact StreetLink for outreach
2. Emergency accommodation assessment
3. Contact local authority
4. Pet-friendly service referral
5. Immediate needs stabilization
6. Pets in Crisis referral
7. Outreach team referral

---

## Versioning Best Practices

### Semantic Versioning

Use format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes (e.g., schema changes, removed features)
- **MINOR**: New features (e.g., new services, new questions)
- **PATCH**: Bug fixes and updates (e.g., phone number changes)

Examples:
- `1.0.0` → Initial release
- `1.1.0` → Added 5 new services
- `1.1.1` → Fixed phone numbers
- `2.0.0` → Restructured for new legislation

### Change Log

Maintain a change log in metadata:

```json
{
  "metadata": {
    "version": "1.2.0",
    "changeLog": [
      {
        "version": "1.2.0",
        "date": "2025-02-01",
        "changes": [
          "Added mental health services",
          "Updated Section 188 conditions"
        ]
      },
      {
        "version": "1.1.0",
        "date": "2025-01-15",
        "changes": [
          "Added pet-friendly services",
          "New outreach team contacts"
        ]
      }
    ]
  }
}
```

### Effective Dates

Specify when content becomes active:

```json
{
  "effectiveDate": "2025-04-01",
  "expiryDate": "2026-03-31"
}
```

This handles:
- Scheduled legislation changes
- Seasonal services
- Pilot programs
- Temporary provisions

---

## Loading and Using Content Packs

### In Code

```typescript
import { contentPackLoader } from './engine';

// Load from URL
await contentPackLoader.loadContentPackFromUrl('/content-packs/london-rough-sleeping.json');

// Get the pack
const pack = contentPackLoader.getContentPack('england-wales-london-rough-sleeping');

// Access components
const rules = contentPackLoader.getRules(pack.id);
const actions = contentPackLoader.getActions(pack.id);
const services = contentPackLoader.getServices(pack.id);

// Find specific resources
const petFriendlyServices = contentPackLoader.findPetFriendlyServices(pack.id);
const emergencyServices = contentPackLoader.find24_7Services(pack.id);
```

### Dynamic Loading

Load packs based on user location or needs:

```typescript
async function loadAppropriateContentPack(jurisdiction: string) {
  const packs = contentPackLoader.findByJurisdiction(jurisdiction);
  
  if (packs.length === 0) {
    // Fallback to default pack
    await contentPackLoader.loadContentPackFromUrl('/content-packs/default.json');
  } else {
    // Use most recent version
    const latest = packs.sort((a, b) => 
      b.version.localeCompare(a.version)
    )[0];
    return latest;
  }
}
```

---

## Maintenance and Updates

### Regular Verification

Schedule regular reviews:
- **Weekly**: Service availability and contact info
- **Monthly**: Capacity updates, new services
- **Quarterly**: Legal and policy changes
- **Annually**: Comprehensive review and update

Track last verification:

```json
{
  "metadata": {
    "lastVerified": "2025-11-19",
    "verifiedBy": "service-team@example.org"
  }
}
```

### Update Process

1. **Identify change needed**
   - Law change
   - Service closure/opening
   - Contact info update
   - User feedback

2. **Make changes**
   - Update JSON
   - Increment version
   - Add to change log
   - Update verification date

3. **Validate**
   - Run through test scenarios
   - Verify JSON schema
   - Check all references
   - Test rule logic

4. **Deploy**
   - Stage in test environment
   - User acceptance testing
   - Deploy to production
   - Monitor for issues

5. **Document**
   - Update change log
   - Notify stakeholders
   - Update documentation

### Service Information Updates

When a service changes:

```json
{
  "services": [
    {
      "id": "example_service",
      "name": "Example Service",
      "contact": {
        "phone": "020 7XXX XXXX"  // Updated number
      },
      "metadata": {
        "lastVerified": "2025-11-19",  // Update date
        "dataSource": "Direct contact with service"
      }
    }
  ]
}
```

---

## Multi-Language Support

### Question Translation

```json
{
  "questions": [
    {
      "id": "q1_homeless_tonight",
      "text": {
        "en": "Are you homeless tonight?",
        "pl": "Czy jesteś bezdomny dzisiaj?",
        "cy": "Ydych chi'n ddigartref heno?"
      },
      "description": {
        "en": "This helps us understand urgency",
        "pl": "Pomaga nam zrozumieć pilność",
        "cy": "Mae hyn yn ein helpu i ddeall yr argyfwng"
      }
    }
  ],
  "language": "en",
  "supportedLanguages": ["en", "pl", "cy"]
}
```

### Fallback Strategy

If translation missing:
1. Use default language (usually English)
2. Mark for translation
3. Log warning for content team

```typescript
function getTranslatedText(
  text: string | Record<string, string>,
  language: string,
  defaultLanguage: string = 'en'
): string {
  if (typeof text === 'string') return text;
  return text[language] || text[defaultLanguage] || Object.values(text)[0];
}
```

---

## Quality Assurance

### Validation Checklist

**Structure:**
- [ ] Valid JSON syntax
- [ ] Required fields present
- [ ] Semantic version format
- [ ] No duplicate IDs
- [ ] All references valid

**Content:**
- [ ] Contact information verified
- [ ] Legal references accurate
- [ ] Service details current
- [ ] Question flow logical
- [ ] Rule conditions correct

**Testing:**
- [ ] Test scenarios pass
- [ ] Rules trigger correctly
- [ ] Actions execute properly
- [ ] Services match criteria
- [ ] Translations complete

### Automated Validation

Use the ContentPackLoader's built-in validation:

```typescript
try {
  contentPackLoader.loadContentPack(packData);
  console.log('✓ Content pack valid');
} catch (error) {
  console.error('✗ Validation failed:', error.message);
}
```

This checks:
- Required fields
- Version format
- Duplicate IDs
- Reference integrity

---

## Collaboration and Governance

### Ownership

Define clear ownership:

```json
{
  "metadata": {
    "author": "London Housing Team",
    "maintainer": "housing-team@london.gov.uk",
    "contributors": [
      "Legal Team",
      "Service Providers",
      "User Advocates"
    ]
  }
}
```

### Change Control

Establish process for changes:
1. **Proposal**: Document proposed change
2. **Review**: Legal/service team review
3. **Approval**: Authorized sign-off
4. **Implementation**: Make changes
5. **Testing**: Validate changes
6. **Deployment**: Release new version
7. **Communication**: Notify users

### License and Attribution

```json
{
  "metadata": {
    "license": "CC-BY-SA-4.0",
    "dataSource": "UK Government legislation, charity services",
    "attribution": "Based on Shelter and Crisis service data"
  }
}
```

---

## Best Practices

### 1. Start Small

Begin with:
- One geographic area
- Core services only
- Essential questions
- Key legal rules

Expand gradually based on:
- User feedback
- Identified gaps
- New services
- Legal changes

### 2. Involve Stakeholders

Engage:
- **Service providers**: Accurate information
- **Legal experts**: Correct interpretation
- **Users**: Real needs and language
- **Caseworkers**: Practical workflow
- **Local authorities**: Official guidance

### 3. Keep Current

- Regular verification schedule
- Monitor for changes
- Quick update process
- Clear version control

### 4. Document Everything

- Why decisions were made
- Sources of information
- Verification dates
- Change rationale

### 5. Test Thoroughly

- Multiple user scenarios
- Edge cases
- Error conditions
- Real user testing

---

## Common Pitfalls to Avoid

### 1. Stale Information

**Problem:** Out-of-date service information
**Solution:** Regular verification schedule

### 2. Overly Complex Rules

**Problem:** Rules too complex to understand or maintain
**Solution:** Break into smaller, simpler rules

### 3. Missing Translations

**Problem:** Some content not translated
**Solution:** Track translation status, use fallbacks

### 4. Duplicate Content

**Problem:** Same information in multiple places
**Solution:** Reference, don't duplicate

### 5. Broken References

**Problem:** References to non-existent IDs
**Solution:** Automated validation

---

## Examples in This Repository

### Complete Examples

- `/content-packs/london-rough-sleeping.json` - Full London pack
  - 6 services
  - 3 rules
  - 7 actions
  - 4 questions
  - Legal references
  - Helplines

### Partial Examples

- `/examples/waterloo-dog-homeless-tonight-triage.json` - Triage flow only
  - Shows question structure
  - Demonstrates transitions
  - Example scenario included

---

## Tools and Utilities

### ContentPackLoader

Load and manage packs:

```typescript
import { contentPackLoader } from './engine';

// Load pack
await contentPackLoader.loadContentPackFromUrl('/packs/london.json');

// Find resources
const rules = contentPackLoader.getRules('pack-id');
const petServices = contentPackLoader.findPetFriendlyServices('pack-id');
const emergencyServices = contentPackLoader.find24_7Services('pack-id');
```

### Schema Validation

All content packs should validate against:
- `/schemas/ContentPack.json`
- Referenced schemas for components

---

## Further Reading

- `/docs/SCHEMAS.md` - Detailed schema documentation
- `/docs/TRIAGE_DECISION_TREES.md` - Question flow design
- `/content-packs/london-rough-sleeping.json` - Complete example
- `/examples/` - Additional examples
