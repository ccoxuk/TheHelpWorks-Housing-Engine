# U-HSP Schemas Documentation

This document provides detailed descriptions of the core JSON schemas used in the Universal Homelessness Support Platform (U-HSP).

## Overview

The U-HSP uses a schema-based approach to define:
- **Legal rules** that determine eligibility for housing assistance
- **Action templates** for guiding support workers through assistance procedures
- **Services** available to homeless individuals
- **Questions** for triage and assessment
- **Session state** to track individual cases
- **Content packs** that bundle all resources for a jurisdiction

All schemas are located in the `/schemas` directory and follow JSON Schema Draft 7 specification.

---

## RightRule.json

**Purpose:** Defines legal or policy-based rules that determine eligibility for housing assistance rights.

### Key Fields

- **id** (required): Unique identifier for the rule
- **name** (required): Human-readable name
- **jurisdiction** (required): Legal jurisdiction (e.g., "England", "Wales", "Scotland")
- **legalBasis**: The statute or policy this rule is based on (e.g., "Housing Act 1996 Section 188")
- **priority**: Priority level for rule evaluation (higher = evaluated first)
- **conditions** (required): Conditions that must be met for the rule to apply
- **actions** (required): Array of action template IDs to trigger when rule matches

### Conditions Structure

Conditions use a nested structure with logical operators:

```json
{
  "type": "all",  // "all" (AND), "any" (OR), or "none" (NOT)
  "rules": [
    {
      "field": "situation.homelessTonight",
      "operator": "equals",
      "value": true
    }
  ],
  "nested": [
    {
      "type": "any",
      "rules": [...]
    }
  ]
}
```

**Supported Operators:**
- `equals`, `notEquals`: Exact match
- `greaterThan`, `lessThan`, `greaterThanOrEqual`, `lessThanOrEqual`: Numeric comparison
- `contains`, `notContains`: String/array containment
- `in`, `notIn`: Value in array
- `exists`, `notExists`: Field existence check

### Example

```json
{
  "id": "section_188_emergency_duty",
  "name": "Section 188 Emergency Accommodation Duty",
  "jurisdiction": "England/Wales",
  "legalBasis": "Housing Act 1996 Section 188",
  "priority": 100,
  "conditions": {
    "type": "all",
    "rules": [
      {
        "field": "situation.homelessTonight",
        "operator": "equals",
        "value": true
      },
      {
        "field": "user.hasChildren",
        "operator": "equals",
        "value": true
      }
    ]
  },
  "actions": ["emergency_accommodation_assessment"]
}
```

---

## ActionTemplate.json

**Purpose:** Defines templates for actions that can be taken to assist homeless individuals.

### Key Fields

- **id** (required): Unique identifier
- **name** (required): Human-readable name
- **type** (required): Type of action - `immediate`, `referral`, `application`, `assessment`, `notification`, `documentation`
- **category** (required): Category - `emergency`, `housing`, `financial`, `support`, `legal`, `medical`, `other`
- **urgency**: Urgency level - `critical`, `high`, `medium`, `low`
- **steps**: Ordered list of steps to complete the action
- **contactInfo**: Contact information for executing the action
- **requiredInformation**: Information needed before execution
- **prerequisites**: Action IDs that must be completed first
- **relatedServices**: Service IDs related to this action
- **outcomes**: Possible outcomes and next actions

### Step Structure

Each step can include:
- **order**: Sequential number
- **instruction**: What to do
- **requiresInput**: Whether user input is needed
- **inputFields**: Fields to collect (name, type, validation, etc.)

### Example

```json
{
  "id": "emergency_accommodation_assessment",
  "name": "Emergency Accommodation Assessment",
  "type": "application",
  "category": "housing",
  "urgency": "critical",
  "steps": [
    {
      "order": 1,
      "instruction": "Contact local authority housing department"
    },
    {
      "order": 2,
      "instruction": "Request emergency accommodation under Section 188",
      "requiresInput": true,
      "inputFields": [
        {
          "name": "localAuthority",
          "label": "Which local authority?",
          "type": "text",
          "required": true
        }
      ]
    }
  ],
  "contactInfo": {
    "hoursOfOperation": "24/7 emergency line"
  },
  "estimatedDuration": "2-4 hours"
}
```

---

## Service.json

**Purpose:** Defines services or resources available to homeless individuals.

### Key Fields

- **id** (required): Unique identifier
- **name** (required): Service name
- **type** (required): Service type - `emergency_shelter`, `day_center`, `food_bank`, `medical`, `hotline`, etc.
- **provider** (required): Organization providing the service
- **contact**: Phone, email, website
- **location**: Physical address and coordinates
- **availability**: Schedule and 24/7 status
- **capacity**: Total and available capacity
- **eligibility**: Age restrictions, gender, pets, referral requirements
- **services**: List of specific services provided
- **cost**: Free or paid, with details

### Eligibility

Important eligibility fields:
- **acceptsPets**: Whether pets are allowed
- **requiresReferral**: Whether a referral is needed
- **localConnectionRequired**: Whether local connection is required
- **ageRestrictions**: Min/max age limits
- **genderRestrictions**: Gender restrictions if any

### Example

```json
{
  "id": "hope_house_pet_friendly_shelter",
  "name": "Hope House Pet-Friendly Emergency Shelter",
  "type": "emergency_shelter",
  "provider": {
    "name": "Hope House Foundation",
    "type": "charity"
  },
  "contact": {
    "phone": "020 7123 4567",
    "emergencyPhone": "020 7123 4568"
  },
  "location": {
    "address": {
      "street": "123 Waterloo Road",
      "city": "London",
      "postcode": "SE1 8XX"
    }
  },
  "availability": {
    "isAvailable24_7": true
  },
  "eligibility": {
    "acceptsPets": true,
    "petRestrictions": "Dogs and cats if well-behaved"
  },
  "cost": {
    "isFree": true
  }
}
```

---

## Question.json

**Purpose:** Defines questions in the triage decision tree.

### Key Fields

- **id** (required): Unique identifier
- **text** (required): Question text to display
- **type** (required): Question type - `yes_no`, `single_choice`, `multiple_choice`, `text`, `number`, `date`, `location`
- **category**: Question category - `personal`, `situation`, `housing`, `financial`, `health`, `legal`, `family`, `pets`, `other`
- **required**: Whether answer is required (default: true)
- **options**: Available options for choice questions
- **validation**: Validation rules for the answer
- **stateMapping**: Path in session state to store answer
- **transitions**: Rules for determining next question/action
- **priority**: Priority for asking (higher = asked sooner)
- **showIf**: Conditions for showing this question

### Transitions

Transitions determine what happens after a question is answered:

```json
{
  "transitions": [
    {
      "condition": {
        "operator": "equals",
        "value": true
      },
      "next": {
        "type": "question",
        "id": "q2_current_location"
      }
    }
  ],
  "defaultTransition": {
    "type": "end",
    "message": "Assessment complete"
  }
}
```

### Example

```json
{
  "id": "q1_homeless_tonight",
  "text": "Are you homeless or will you be homeless tonight?",
  "type": "yes_no",
  "category": "situation",
  "required": true,
  "stateMapping": "situation.homelessTonight",
  "transitions": [
    {
      "condition": {
        "operator": "equals",
        "value": true
      },
      "next": {
        "type": "question",
        "id": "q2_current_location"
      }
    }
  ],
  "priority": 100
}
```

---

## SessionState.json

**Purpose:** Represents the current state of a user's assistance session.

### Key Fields

- **sessionId** (required): Unique identifier for this session
- **createdAt** (required): When session was created
- **status** (required): Session status - `active`, `completed`, `abandoned`, `escalated`
- **user**: Personal information (name, age, contact, children, pets, disabilities)
- **situation**: Current housing situation (homeless status, location, urgency)
- **housing**: Housing history and preferences
- **legal**: Legal status and eligibility
- **currentQuestion**: ID of current question
- **answers**: Map of question IDs to answers
- **triggeredRules**: Rules that have matched
- **completedActions**: Actions that have been completed
- **pendingActions**: Actions that need to be completed
- **recommendedServices**: Services recommended for user
- **notes**: Case notes and observations
- **metadata**: Session metadata (content pack, jurisdiction, channel)

### State Mapping

Questions use dot notation to map to session state:
- `user.hasChildren` → `sessionState.user.hasChildren`
- `situation.homelessTonight` → `sessionState.situation.homelessTonight`
- `legal.rightToReside` → `sessionState.legal.rightToReside`

### Example

```json
{
  "sessionId": "sess_abc123",
  "createdAt": "2025-11-19T10:00:00Z",
  "status": "active",
  "user": {
    "age": 32,
    "hasChildren": false,
    "hasPets": true,
    "pets": [
      {
        "type": "dog",
        "size": "medium"
      }
    ]
  },
  "situation": {
    "homelessTonight": true,
    "currentLocation": "Waterloo Station, London",
    "urgentNeeds": ["shelter", "safety"]
  },
  "currentQuestion": "q3_has_pets",
  "answers": {
    "q1_homeless_tonight": true,
    "q2_current_location": "Waterloo Station"
  },
  "metadata": {
    "contentPackId": "england-wales-london-rough-sleeping",
    "jurisdiction": "England/Wales"
  }
}
```

---

## ContentPack.json

**Purpose:** A complete content pack containing all localized resources, rules, and workflows for a specific jurisdiction.

### Key Fields

- **id** (required): Unique identifier
- **name** (required): Human-readable name
- **version** (required): Semantic version (e.g., "1.0.0")
- **jurisdiction** (required): Legal jurisdiction
- **language**: Primary language code
- **effectiveDate**: When pack becomes effective
- **entryPoint**: ID of first question in triage flow
- **questions**: Array of Question objects
- **rules**: Array of RightRule objects
- **actions**: Array of ActionTemplate objects
- **services**: Array of Service objects
- **workflows**: Pre-defined workflows for common scenarios
- **legalReferences**: References to legislation and policies
- **resources**: Additional resources (documents, helplines)

### Workflows

Workflows define sequences of questions, rules, and actions:

```json
{
  "id": "emergency_housing_workflow",
  "name": "Emergency Housing Workflow",
  "trigger": {
    "conditions": [...]
  },
  "steps": [
    {
      "order": 1,
      "type": "question",
      "id": "q1_homeless_tonight"
    },
    {
      "order": 2,
      "type": "rule_check",
      "id": "section_188_check"
    },
    {
      "order": 3,
      "type": "action",
      "id": "emergency_accommodation_assessment"
    }
  ]
}
```

### Example

See `/content-packs/london-rough-sleeping.json` for a complete example.

---

## Best Practices

### Schema Design

1. **Use descriptive IDs**: Use kebab-case and include context (e.g., `section_188_emergency_duty` not `rule1`)
2. **Set appropriate priorities**: Higher numbers = higher priority
3. **Include metadata**: Always add version, author, and tags
4. **Document legal basis**: Reference specific legislation for rules
5. **Provide help text**: Include descriptions and guidance for users

### Condition Logic

1. **Keep conditions simple**: Break complex logic into nested groups
2. **Test thoroughly**: Ensure conditions work for edge cases
3. **Use appropriate operators**: Choose the most specific operator
4. **Consider null values**: Use `exists`/`notExists` when appropriate

### Action Design

1. **Be specific**: Clear, actionable steps
2. **Include contact info**: Always provide ways to get help
3. **Set urgency correctly**: Critical actions need immediate attention
4. **Link related services**: Help users find relevant resources
5. **Define outcomes**: Specify what happens next

### Service Information

1. **Keep current**: Regular verification is essential
2. **Be comprehensive**: Include all relevant contact and location info
3. **Specify eligibility clearly**: Avoid wasting time on unsuitable services
4. **Note pet policies**: Many homeless people have pets
5. **Include accessibility**: Physical and service accessibility matters

---

## Validation

All schemas can be validated using standard JSON Schema validators. The schemas include:
- Type constraints
- Required field validation
- Format validation (dates, URIs, emails)
- Enum constraints for fixed values
- Pattern matching for strings
- Min/max constraints for numbers

---

## Further Reading

- See `/docs/TRIAGE_DECISION_TREES.md` for guidance on designing triage flows
- See `/docs/CONTENT_PACKS.md` for creating and managing content packs
- See `/examples` for worked examples
