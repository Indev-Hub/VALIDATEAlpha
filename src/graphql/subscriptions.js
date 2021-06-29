/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
      id
      username
      email
      companies {
        items {
          id
          title
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
      id
      username
      email
      companies {
        items {
          id
          title
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
      id
      username
      email
      companies {
        items {
          id
          title
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
export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany {
    onCreateCompany {
      id
      title
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
export const onUpdateCompany = /* GraphQL */ `
  subscription OnUpdateCompany {
    onUpdateCompany {
      id
      title
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
export const onDeleteCompany = /* GraphQL */ `
  subscription OnDeleteCompany {
    onDeleteCompany {
      id
      title
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
export const onCreateForm = /* GraphQL */ `
  subscription OnCreateForm {
    onCreateForm {
      id
      companyID
      company {
        id
        title
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
export const onUpdateForm = /* GraphQL */ `
  subscription OnUpdateForm {
    onUpdateForm {
      id
      companyID
      company {
        id
        title
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
export const onDeleteForm = /* GraphQL */ `
  subscription OnDeleteForm {
    onDeleteForm {
      id
      companyID
      company {
        id
        title
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
export const onCreateFormSubmission = /* GraphQL */ `
  subscription OnCreateFormSubmission {
    onCreateFormSubmission {
      id
      formID
      form {
        id
        companyID
        company {
          id
          title
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
export const onUpdateFormSubmission = /* GraphQL */ `
  subscription OnUpdateFormSubmission {
    onUpdateFormSubmission {
      id
      formID
      form {
        id
        companyID
        company {
          id
          title
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
export const onDeleteFormSubmission = /* GraphQL */ `
  subscription OnDeleteFormSubmission {
    onDeleteFormSubmission {
      id
      formID
      form {
        id
        companyID
        company {
          id
          title
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
