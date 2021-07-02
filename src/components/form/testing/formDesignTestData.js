const formDesignX = {
  "id": "form-3182",
  "companyID": "company-1",
  "title": "Form 1",
  "description": "Form 1 description.",
  "validations": [
    {
      "question": "Form 1 Question 1",
      "type": "Radio Group",
      "options": [
        "Red",
        "Yellow",
        "Green",
      ]
    },
    {
      "question": "Form 1 Question 2",
      "type": "Checkbox",
      "options": [
        "North",
        "South",
        "East",
        "West",
      ]
    }
  ]
}

const formDesign = {
  "id": "form-3182",
  "companyID": "company-1",
  "title": "Form 1",
  "description": "Form 1 description.",
  "validations": [
    {
      "question": "Form 1 Question 1",
      "type": "Radio Group",
      "options": [
        {
          "option-1": "Red"
        },
        {
          "option-2": "Yellow"
        },
        {
          "option-3": "Green"
        }
      ]
    },
    {
      "question": "Form 1 Question 2",
      "type": "Checkbox",
      "options": [
        {
          "option-1": "North"
        },
        {
          "option-2": "South"
        },
        {
          "option-3": "East"
        },
        {
          "option-4": "West"
        }
      ]
    }
  ]
}

export default formDesign;
