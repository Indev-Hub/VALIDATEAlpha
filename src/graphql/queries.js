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
          createdAt
          updatedAt
        }
        nextToken
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
      user {
        id
        username
        email
        companies {
          nextToken
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
          validations
          createdAt
          updatedAt
        }
        nextToken
      }
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
        user {
          id
          username
          email
          createdAt
          updatedAt
        }
        forms {
          nextToken
        }
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
      company {
        id
        name
        userID
        user {
          id
          username
          email
          createdAt
          updatedAt
        }
        forms {
          nextToken
        }
        createdAt
        updatedAt
      }
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
        company {
          id
          name
          userID
          createdAt
          updatedAt
        }
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
