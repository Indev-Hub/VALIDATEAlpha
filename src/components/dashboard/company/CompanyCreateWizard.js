import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Avatar, Box, Button, Card, CardContent, Typography } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import CompanyDetailsForm from './CompanyDetailsForm';
import CompanyOptionForm from './CompanyOptionForm';
import useAuth from 'src/hooks/useAuth';
import { API, graphqlOperation } from 'aws-amplify';
import { createCompany, updateUser } from 'src/graphql/mutations';

const CompanyCreateWizard = (props) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [companyData, setCompanyData] = useState({
    id: '',
    name: '',
    manager: '',
    category: '',
    description: '',
    tags: [] 
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleComplete = () => {
    setCompleted(true);
  };

    // Get user attributes
    const { user } = useAuth();
  
    const handleCompanyChange = (e) => {
      setCompanyData({
        ...companyData,
        [e.target.name]: e.target.value
      });
    };
  
    async function addCompany() {
      // Destructure companyData
      const { name, description, tags } = companyData;
  
      // Create Company Inputs
      const CreateCompanyInput = {
        name: name, 
        userID: user.id,
        companyManagerId: user.id,
        description: description,
        tags: JSON.stringify(tags)
      };
  
      // Create new company
      const newCompany = await API.graphql(graphqlOperation(createCompany, { input: CreateCompanyInput }));
      console.log('newCompany:', newCompany)
  
      return newCompany.data.createCompany;
    }
  
    async function Update() {
      // showPendingState();
      try {
        const response = await addCompany();
        console.log('addCompany', response);
  
        // Data input for updateUser call
        const UpdateUserInput = {
          id: user.id,
          userCompanyId: response.id
        }
  
        // Updates the User table to include the newly created Channel. Only one company is allowed per user
        // This will overwrite a company if it exists in the user.company field
        const upUser = await API.graphql(graphqlOperation(updateUser, { input: UpdateUserInput }))
        console.log('User Updated!', upUser) 
  
      } catch (error) {
          console.log('error on user update:', error);
      }
    }
  

  return (
    <div {...props}>
      {!completed
        ? (
          <>
            {activeStep === 0 && (
              <CompanyDetailsForm companyData={companyData} onNext={handleNext} setCompanyData={setCompanyData} submit={Update} handleCompanyChange={handleCompanyChange} />
            )}
            {activeStep === 1 && (
              <CompanyOptionForm
                onBack={handleBack}
                handleCompanyChange={handleCompanyChange}
                onComplete={handleComplete}
              />
            )}
          </>
        )
        : (
          <Card>
            <CardContent>
              <Box
                sx={{
                  maxWidth: 450,
                  mx: 'auto'
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText'
                    }}
                  >
                    <StarIcon fontSize="small" />
                  </Avatar>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    align="center"
                    color="textPrimary"
                    variant="h3"
                  >
                    You are all done!
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography
                    align="center"
                    color="textSecondary"
                    variant="subtitle1"
                  >
                    We just need some basic information to add your company. Don't worry, you can always edit this information later on, too. 
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 2
                  }}
                >
                  <Button
                    color="primary"
                    component={RouterLink}
                    to="/dashboard/projects/1"
                    variant="contained"
                  >
                    View project
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}
      {console.log('company data update:', companyData)}
    </div>
  );
};

export default CompanyCreateWizard;
