const formDesign = {
  id: "form1",
  companyID: "company1",
  name: "Sample Form 1",
  description: "This is the description of sample form 1.",
  validations: [
    {
      question: "What is your name?",
      type: "Text Input",
      option: ""
    },
    {
      question: "What languages do you speak?",
      type: "Checkbox",
      option: [
        "Checkbox 1",
        "Checkbox 2",
        "Checkbox 3",
        "Checkbox 4",
        "Checkbox 5",
      ]
    },
    {
      question: "Which color is your favorite?",
      type: "Dropdown",
      option: [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Blue",
        "Indigo",
        "Violet",
      ]
    },
    {
      question: "Select your preference:",
      type: "Radio Group",
      option: [
        "Radio One",
        "Radio Two",
        "Radio Three",
      ]
    },
    {
      question: "How do you rate this?",
      type: "Rating",
      option: ""
    },
  ]
};

const formDesignX = {
  id: "form2",
  companyID: "company1",
  name: "Sample Form 2",
  description: "Sample Form 2's description.",
  validations: [
    {
      question: "Question 1",
      type: "Checkbox",
      option: [
        "I have read the company's overview and history of this product"
      ]
    },
    {
      question: "Question 2",
      type: "Text Input",
      option: ""
    },
    {
      question: "Question 3",
      type: "Text Input",
      option: ""
    },
    {
      question: "Question 4",
      type: "Dropdown",
      option: [
        "Left",
        "Right",
        "Top",
        "Bottom",
      ]
    },
    {
      question: "Question 5",
      type: "Checkbox",
      option: [
        "Red",
        "Orange",
        "Yellow",
        "Green",
        "Blue",
        "Indigo",
        "Violet",
      ]
    },
    {
      question: "Question 6",
      type: "Text Input",
      option: ""
    },
    {
      question: "Question 7",
      type: "Rating",
      option: ""
    },
    {
      question: "Question 8",
      type: "Radio Group",
      option: [
        "Radio One",
        "Radio Two",
        "Radio Three",
        "Radio Four",
      ]
    },
  ]
};

export default formDesign;
