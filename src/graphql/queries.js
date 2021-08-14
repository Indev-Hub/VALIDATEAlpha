/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getCompany = /* GraphQL */ `
  query GetCompany($id: ID!) {
    getCompany(id: $id) {
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
      employees {
        items {
          id
          username
          email
          createdAt
          updatedAt
        }
        nextToken
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
export const listCompanys = /* GraphQL */ `
  query ListCompanys(
    $filter: ModelCompanyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCompanys(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
        employees {
          nextToken
        }
        forms {
          nextToken
        }
        description
        tags
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getForm = /* GraphQL */ `
  query GetForm($id: ID!) {
    getForm(id: $id) {
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
        employees {
          nextToken
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
export const listForms = /* GraphQL */ `
  query ListForms(
    $filter: ModelFormFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listForms(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getFormSubmission = /* GraphQL */ `
  query GetFormSubmission($id: ID!) {
    getFormSubmission(id: $id) {
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
export const listFormSubmissions = /* GraphQL */ `
  query ListFormSubmissions(
    $filter: ModelFormSubmissionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listFormSubmissions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        formID
        form {
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
        answers
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getDemographics = /* GraphQL */ `
  query GetDemographics($id: ID!) {
    getDemographics(id: $id) {
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
export const listDemographicss = /* GraphQL */ `
  query ListDemographicss(
    $filter: ModelDemographicsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDemographicss(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
