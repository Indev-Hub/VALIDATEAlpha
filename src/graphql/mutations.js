/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      email
      companies {
        items {
          id
          name
          userID
          description
          tags
          createdAt
          updatedAt
        }
        nextToken
      }
      demographics {
        id
        userID
        firstName
        lastName
        birthday
        sex
        gender
        household
        maritalStatus
        city
        state
        country
        income
        homeowner
        education
        profession
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      email
      companies {
        items {
          id
          name
          userID
          description
          tags
          createdAt
          updatedAt
        }
        nextToken
      }
      demographics {
        id
        userID
        firstName
        lastName
        birthday
        sex
        gender
        household
        maritalStatus
        city
        state
        country
        income
        homeowner
        education
        profession
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      email
      companies {
        items {
          id
          name
          userID
          description
          tags
          createdAt
          updatedAt
        }
        nextToken
      }
      demographics {
        id
        userID
        firstName
        lastName
        birthday
        sex
        gender
        household
        maritalStatus
        city
        state
        country
        income
        homeowner
        education
        profession
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createCompany = /* GraphQL */ `
  mutation CreateCompany(
    $input: CreateCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    createCompany(input: $input, condition: $condition) {
      id
      name
      userID
      manager {
        id
        username
        email
        companies {
          nextToken
        }
        demographics {
          id
          userID
          firstName
          lastName
          birthday
          sex
          gender
          household
          maritalStatus
          city
          state
          country
          income
          homeowner
          education
          profession
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      forms {
        items {
          id
          companyID
          title
          description
          isPrivate
          tags
          validations
          createdAt
          updatedAt
        }
        nextToken
      }
      description
      tags
      createdAt
      updatedAt
    }
  }
`;
export const updateCompany = /* GraphQL */ `
  mutation UpdateCompany(
    $input: UpdateCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    updateCompany(input: $input, condition: $condition) {
      id
      name
      userID
      manager {
        id
        username
        email
        companies {
          nextToken
        }
        demographics {
          id
          userID
          firstName
          lastName
          birthday
          sex
          gender
          household
          maritalStatus
          city
          state
          country
          income
          homeowner
          education
          profession
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      forms {
        items {
          id
          companyID
          title
          description
          isPrivate
          tags
          validations
          createdAt
          updatedAt
        }
        nextToken
      }
      description
      tags
      createdAt
      updatedAt
    }
  }
`;
export const deleteCompany = /* GraphQL */ `
  mutation DeleteCompany(
    $input: DeleteCompanyInput!
    $condition: ModelCompanyConditionInput
  ) {
    deleteCompany(input: $input, condition: $condition) {
      id
      name
      userID
      manager {
        id
        username
        email
        companies {
          nextToken
        }
        demographics {
          id
          userID
          firstName
          lastName
          birthday
          sex
          gender
          household
          maritalStatus
          city
          state
          country
          income
          homeowner
          education
          profession
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      forms {
        items {
          id
          companyID
          title
          description
          isPrivate
          tags
          validations
          createdAt
          updatedAt
        }
        nextToken
      }
      description
      tags
      createdAt
      updatedAt
    }
  }
`;
export const createForm = /* GraphQL */ `
  mutation CreateForm(
    $input: CreateFormInput!
    $condition: ModelFormConditionInput
  ) {
    createForm(input: $input, condition: $condition) {
      id
      companyID
      title
      description
      isPrivate
      company {
        id
        name
        userID
        manager {
          id
          username
          email
          createdAt
          updatedAt
        }
        forms {
          nextToken
        }
        description
        tags
        createdAt
        updatedAt
      }
      tags
      validations
      createdAt
      updatedAt
    }
  }
`;
export const updateForm = /* GraphQL */ `
  mutation UpdateForm(
    $input: UpdateFormInput!
    $condition: ModelFormConditionInput
  ) {
    updateForm(input: $input, condition: $condition) {
      id
      companyID
      title
      description
      isPrivate
      company {
        id
        name
        userID
        manager {
          id
          username
          email
          createdAt
          updatedAt
        }
        forms {
          nextToken
        }
        description
        tags
        createdAt
        updatedAt
      }
      tags
      validations
      createdAt
      updatedAt
    }
  }
`;
export const deleteForm = /* GraphQL */ `
  mutation DeleteForm(
    $input: DeleteFormInput!
    $condition: ModelFormConditionInput
  ) {
    deleteForm(input: $input, condition: $condition) {
      id
      companyID
      title
      description
      isPrivate
      company {
        id
        name
        userID
        manager {
          id
          username
          email
          createdAt
          updatedAt
        }
        forms {
          nextToken
        }
        description
        tags
        createdAt
        updatedAt
      }
      tags
      validations
      createdAt
      updatedAt
    }
  }
`;
export const createFormSubmission = /* GraphQL */ `
  mutation CreateFormSubmission(
    $input: CreateFormSubmissionInput!
    $condition: ModelFormSubmissionConditionInput
  ) {
    createFormSubmission(input: $input, condition: $condition) {
      id
      formID
      form {
        id
        companyID
        title
        description
        isPrivate
        company {
          id
          name
          userID
          description
          tags
          createdAt
          updatedAt
        }
        tags
        validations
        createdAt
        updatedAt
      }
      answers
      createdAt
      updatedAt
    }
  }
`;
export const updateFormSubmission = /* GraphQL */ `
  mutation UpdateFormSubmission(
    $input: UpdateFormSubmissionInput!
    $condition: ModelFormSubmissionConditionInput
  ) {
    updateFormSubmission(input: $input, condition: $condition) {
      id
      formID
      form {
        id
        companyID
        title
        description
        isPrivate
        company {
          id
          name
          userID
          description
          tags
          createdAt
          updatedAt
        }
        tags
        validations
        createdAt
        updatedAt
      }
      answers
      createdAt
      updatedAt
    }
  }
`;
export const deleteFormSubmission = /* GraphQL */ `
  mutation DeleteFormSubmission(
    $input: DeleteFormSubmissionInput!
    $condition: ModelFormSubmissionConditionInput
  ) {
    deleteFormSubmission(input: $input, condition: $condition) {
      id
      formID
      form {
        id
        companyID
        title
        description
        isPrivate
        company {
          id
          name
          userID
          description
          tags
          createdAt
          updatedAt
        }
        tags
        validations
        createdAt
        updatedAt
      }
      answers
      createdAt
      updatedAt
    }
  }
`;
export const createDemographics = /* GraphQL */ `
  mutation CreateDemographics(
    $input: CreateDemographicsInput!
    $condition: ModelDemographicsConditionInput
  ) {
    createDemographics(input: $input, condition: $condition) {
      id
      userID
      firstName
      lastName
      birthday
      sex
      gender
      household
      maritalStatus
      city
      state
      country
      income
      homeowner
      education
      profession
      createdAt
      updatedAt
    }
  }
`;
export const updateDemographics = /* GraphQL */ `
  mutation UpdateDemographics(
    $input: UpdateDemographicsInput!
    $condition: ModelDemographicsConditionInput
  ) {
    updateDemographics(input: $input, condition: $condition) {
      id
      userID
      firstName
      lastName
      birthday
      sex
      gender
      household
      maritalStatus
      city
      state
      country
      income
      homeowner
      education
      profession
      createdAt
      updatedAt
    }
  }
`;
export const deleteDemographics = /* GraphQL */ `
  mutation DeleteDemographics(
    $input: DeleteDemographicsInput!
    $condition: ModelDemographicsConditionInput
  ) {
    deleteDemographics(input: $input, condition: $condition) {
      id
      userID
      firstName
      lastName
      birthday
      sex
      gender
      household
      maritalStatus
      city
      state
      country
      income
      homeowner
      education
      profession
      createdAt
      updatedAt
    }
  }
`;
