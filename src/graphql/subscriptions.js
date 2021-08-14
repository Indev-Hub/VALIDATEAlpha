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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateCompany = /* GraphQL */ `
  subscription OnCreateCompany {
    onCreateCompany {
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
export const onUpdateCompany = /* GraphQL */ `
  subscription OnUpdateCompany {
    onUpdateCompany {
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
export const onDeleteCompany = /* GraphQL */ `
  subscription OnDeleteCompany {
    onDeleteCompany {
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
export const onCreateForm = /* GraphQL */ `
  subscription OnCreateForm {
    onCreateForm {
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
export const onUpdateForm = /* GraphQL */ `
  subscription OnUpdateForm {
    onUpdateForm {
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
export const onDeleteForm = /* GraphQL */ `
  subscription OnDeleteForm {
    onDeleteForm {
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
export const onCreateFormSubmission = /* GraphQL */ `
  subscription OnCreateFormSubmission {
    onCreateFormSubmission {
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
export const onUpdateFormSubmission = /* GraphQL */ `
  subscription OnUpdateFormSubmission {
    onUpdateFormSubmission {
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
export const onDeleteFormSubmission = /* GraphQL */ `
  subscription OnDeleteFormSubmission {
    onDeleteFormSubmission {
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
export const onCreateDemographics = /* GraphQL */ `
  subscription OnCreateDemographics {
    onCreateDemographics {
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
export const onUpdateDemographics = /* GraphQL */ `
  subscription OnUpdateDemographics {
    onUpdateDemographics {
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
export const onDeleteDemographics = /* GraphQL */ `
  subscription OnDeleteDemographics {
    onDeleteDemographics {
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
