# Triage Decision Trees

This document explains how to design effective triage decision trees for the Universal Homelessness Support Platform (U-HSP).

## Overview

A triage decision tree is a structured sequence of questions that:
1. Gathers essential information about a person's situation
2. Determines their eligibility for various forms of assistance
3. Triggers appropriate actions and services
4. Prioritizes urgent needs

The U-HSP uses a dynamic, rule-based approach where questions can branch based on answers, and rules are evaluated continuously as information is gathered.

---

## Core Concepts

### Questions

Questions are the building blocks of a triage flow. Each question:
- Has a unique ID
- Asks for specific information
- Maps the answer to session state
- Defines transitions to next steps

### Transitions

Transitions determine what happens after a question is answered:
- **Next question**: Continue gathering information
- **Action**: Trigger an immediate action
- **End**: Complete the assessment

### Rules

Rules run in the background and are evaluated whenever session state changes. When conditions are met, rules trigger actions automatically.

### Priority

Questions have priority levels that determine their order:
- **Critical questions** (100+): Safety and immediate needs
- **High priority** (80-99): Priority need assessment
- **Medium priority** (50-79): General eligibility
- **Low priority** (0-49): Additional information

---

## Design Principles

### 1. Safety First

**Always ask about immediate safety concerns first:**
- Are you homeless tonight?
- Are you at risk of violence?
- Do you have urgent medical needs?

These questions should have the highest priority and trigger immediate actions.

### 2. Establish Priority Need

Under UK homelessness legislation, priority need includes:
- Families with children
- Pregnancy
- Young people (16-17, care leavers under 21)
- Vulnerability (age, disability, emergency)
- Victims of domestic abuse or violence

Ask questions to establish priority need early in the flow.

### 3. Location Matters

Ask for current location:
- Enables location-based service recommendations
- Determines which local authority has responsibility
- Helps outreach teams find rough sleepers

### 4. Practical Constraints

Consider practical factors that affect service access:
- **Pets**: Many services don't accept pets
- **Children**: Affects accommodation type
- **Mobility**: Accessibility requirements
- **Language**: Communication needs

### 5. Legal Eligibility

Gather information needed for legal assessment:
- Right to reside in UK
- Local connection to area
- Whether homeless is intentional
- Immigration status (if relevant)

---

## Flow Patterns

### Linear Flow

Simplest pattern - questions in sequence:

```
Q1 → Q2 → Q3 → Q4 → End
```

**Use when:**
- All questions are always relevant
- Order is fixed
- No branching needed

### Branching Flow

Questions lead to different paths:

```
       → Q2a → Q3a
      /
Q1 →
      \
       → Q2b → Q3b
```

**Use when:**
- Some questions only relevant based on previous answers
- Different user groups need different questions
- Efficiency matters (skip irrelevant questions)

### Priority-Based Flow

Questions asked in priority order, with dynamic transitions:

```
Q_priority_100 → Q_priority_90 → Q_priority_85 → ...
```

**Use when:**
- Need flexibility in question order
- Want to gather most important information first
- Rules may trigger mid-flow

### Hybrid Flow

Combination of approaches:

```
Safety Questions (priority 100)
  ↓
Priority Need Questions (priority 80-90)
  ↓
Branching based on circumstances
  ↓
Additional Details (priority 50-79)
```

**Recommended for most use cases.**

---

## Example: Waterloo Station Scenario

Let's walk through the "Waterloo + dog + homeless tonight" example from `/examples/waterloo-dog-homeless-tonight-triage.json`.

### Scenario Context

- Person at Waterloo Station
- Has a dog
- Will be homeless tonight
- Need urgent accommodation

### Question Flow

**1. Immediate Safety (Priority 100)**

```json
{
  "id": "q1_homeless_tonight",
  "text": "Are you homeless or will you be homeless tonight?",
  "type": "yes_no",
  "priority": 100,
  "stateMapping": "situation.homelessTonight",
  "transitions": [
    {
      "condition": {"operator": "equals", "value": true},
      "next": {"type": "question", "id": "q2_current_location"}
    }
  ]
}
```

This establishes urgency and triggers emergency pathways.

**2. Location (Priority 90)**

```json
{
  "id": "q2_current_location",
  "text": "Where are you right now?",
  "type": "text",
  "priority": 90,
  "stateMapping": "situation.currentLocation"
}
```

Enables location-based services and outreach.

**3. Practical Constraints (Priority 85)**

```json
{
  "id": "q3_has_pets",
  "text": "Do you have any pets with you?",
  "type": "yes_no",
  "priority": 85,
  "stateMapping": "user.hasPets",
  "transitions": [
    {
      "condition": {"operator": "equals", "value": true},
      "next": {"type": "question", "id": "q4_pet_type"}
    },
    {
      "condition": {"operator": "equals", "value": false},
      "next": {"type": "question", "id": "q5_has_children"}
    }
  ]
}
```

Branches based on whether they have pets (affects service options).

**4. Priority Need (Priority 80)**

```json
{
  "id": "q5_has_children",
  "text": "Do you have any children with you?",
  "type": "yes_no",
  "priority": 80,
  "stateMapping": "user.hasChildren"
}
```

Establishes priority need status.

### Rule Evaluation

After gathering this information, rules are evaluated:

**Section 188 Emergency Duty:**
```json
{
  "id": "section_188_emergency_duty",
  "conditions": {
    "type": "all",
    "rules": [
      {"field": "situation.homelessTonight", "operator": "equals", "value": true},
      {"field": "user.hasChildren", "operator": "equals", "value": true}
    ]
  },
  "actions": ["emergency_accommodation_assessment"]
}
```

**Pet-Friendly Services:**
```json
{
  "id": "pet_friendly_shelter_priority",
  "conditions": {
    "type": "all",
    "rules": [
      {"field": "user.hasPets", "operator": "equals", "value": true},
      {"field": "situation.homelessTonight", "operator": "equals", "value": true}
    ]
  },
  "actions": ["contact_pet_friendly_services"]
}
```

### Actions Triggered

Based on the scenario:
1. **Contact StreetLink** - Report rough sleeper for outreach
2. **Emergency Accommodation Assessment** - If has children
3. **Contact Pet-Friendly Services** - Has a dog
4. **Local Authority Contact** - Emergency housing team

---

## Question Design Best Practices

### 1. Clear, Simple Language

**Good:**
> "Do you have any children with you?"

**Bad:**
> "Are there any dependent minors currently in your care or custody?"

### 2. One Concept Per Question

**Good:**
```
Q1: "Do you have pets?"
Q2: "What type of pet?"
```

**Bad:**
```
Q1: "Do you have pets and if so what type and are they well-behaved?"
```

### 3. Provide Context

```json
{
  "text": "Are you at risk of violence?",
  "description": "Your safety is our priority. This helps us provide appropriate support."
}
```

### 4. Include Help Text

```json
{
  "helpText": "Local connection means you have lived, worked, or have family in this area."
}
```

### 5. Validate Appropriately

```json
{
  "type": "number",
  "validation": {
    "min": 0,
    "max": 120,
    "customMessage": "Please enter a valid age"
  }
}
```

---

## Transition Logic

### Simple Yes/No Branching

```json
{
  "transitions": [
    {
      "condition": {"operator": "equals", "value": true},
      "next": {"type": "question", "id": "follow_up_yes"}
    },
    {
      "condition": {"operator": "equals", "value": false},
      "next": {"type": "question", "id": "follow_up_no"}
    }
  ]
}
```

### Multiple Choice Branching

```json
{
  "transitions": [
    {
      "condition": {"operator": "in", "values": ["eviction", "financial"]},
      "next": {"type": "action", "id": "prevention_support"}
    },
    {
      "condition": {"operator": "in", "values": ["domestic_abuse", "violence"]},
      "next": {"type": "action", "id": "safety_first"}
    }
  ],
  "defaultTransition": {
    "type": "question",
    "id": "general_follow_up"
  }
}
```

### Conditional Display

Only show a question if certain conditions are met:

```json
{
  "id": "q6_number_of_children",
  "showIf": {
    "field": "user.hasChildren",
    "operator": "equals",
    "value": true
  }
}
```

---

## Testing Your Decision Tree

### 1. Test All Paths

Create test scenarios for:
- Minimum path (simplest case)
- Maximum path (most complex case)
- Each major branch
- Edge cases

### 2. Verify Rule Triggers

For each scenario, check:
- Which rules should trigger
- Which actions should execute
- Which services should be recommended

### 3. Check Question Order

Ensure:
- Critical questions come first
- Flow makes logical sense
- No redundant questions
- No missing information

### 4. User Testing

Have actual users (or proxies) go through the flow:
- Time how long it takes
- Note confusion points
- Gather feedback on language
- Check for missing options

---

## Common Patterns

### Emergency Triage

```
1. Homeless tonight? → Yes → Immediate action
2. At risk of violence? → Yes → Safety action
3. Medical emergency? → Yes → Medical action
4. Current location? → Outreach/services
5. Has children/pregnant? → Priority need
6. Assessment and services
```

### Prevention Pathway

```
1. Risk of homelessness? → Timeframe?
2. Reason for risk? → Specific support
3. Current tenancy? → Rights/options
4. Financial situation? → Support available
5. Prevention plan
```

### Rough Sleeping Response

```
1. Current location → Outreach alert
2. How long rough sleeping? → Urgency
3. Immediate needs? → Emergency response
4. Has engaged with services? → Next steps
5. Assessment and accommodation
```

---

## Integration with Rules and Actions

### When to Use Questions vs Rules

**Use Questions when:**
- Information must be gathered from user
- Answer affects next steps in conversation
- Need user confirmation or choice

**Use Rules when:**
- Legal logic determines eligibility
- Automatic actions can be triggered
- Complex conditions need evaluation
- No user input needed

### Coordinating Questions and Rules

```
User answers Q1 → Update session state
                → Evaluate all rules
                → Trigger matching actions
                → Determine next question
                → Present Q2
```

Rules run continuously in the background, so actions can trigger even mid-questionnaire.

---

## Localization Considerations

### Language Support

Questions should support multiple languages:

```json
{
  "text": {
    "en": "Do you have any children?",
    "cy": "Oes gennych chi blant?",
    "pl": "Czy masz dzieci?"
  }
}
```

### Cultural Sensitivity

- Use inclusive language
- Consider cultural norms
- Provide context for sensitive questions
- Respect privacy concerns

### Regional Variations

Different jurisdictions may need:
- Different questions
- Different order
- Different legal terminology
- Different service types

---

## Performance Optimization

### Minimize Questions

- Only ask what's necessary
- Use conditional display
- Skip obvious follow-ups
- Combine related questions where appropriate

### Prioritize Critical Path

- Most important information first
- Quick initial assessment
- Detailed questions later if needed

### Save Partial Progress

- Save after each answer
- Allow resuming later
- Don't force completion

---

## Examples in This Repository

See `/examples/` for complete worked examples:

- **waterloo-dog-homeless-tonight-triage.json**: Full emergency triage scenario
- Shows question flow, transitions, expected rules, and actions

---

## Further Reading

- See `/docs/SCHEMAS.md` for detailed schema documentation
- See `/docs/CONTENT_PACKS.md` for bundling questions into packs
- See `/content-packs/london-rough-sleeping.json` for a complete content pack example
