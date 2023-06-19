import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  Alert,
  FormLayout,
  Grid,
  Modal,
  TextField,
} from '@react-ui-org/react-ui';
import { validateContractTermination } from '../../../../services/validatorService';
import { toMomentDateTimeFromDayMonthYear } from '../../../../services/dateTimeService';
import {
  Icon, LoadingIcon,
} from '../../../../components/Icon';

class TerminateContractModalComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        dateTime: null,
      },
      formValidity: {
        elements: {
          dateTime: null,
        },
        isValid: false,
      },
      validationMessage: null,
    };

    this.onChange = this.onChange.bind(this);
    this.onTerminate = this.onTerminate.bind(this);
  }

  onChange(id, value) {
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [id]: value,
      },
    }));
  }

  async onTerminate() {
    const {
      contract,
      onTerminate,
      t,
      workMonths,
    } = this.props;
    const { formData } = this.state;

    const formValidity = validateContractTermination(t, formData, contract, workMonths);

    this.setState({ formValidity });

    if (formValidity.isValid) {
      const response = await onTerminate(contract.id, {
        dateTime: toMomentDateTimeFromDayMonthYear(formData.dateTime)
          .set('hour', 23)
          .set('minute', 59)
          .set('second', 59),
      });

      if (response.error) {
        this.setState({ validationMessage: t('user:validation.cannotTerminateContract') });
      } else {
        this.setState({ validationMessage: null });
      }
    }
  }

  render() {
    const {
      isPosting,
      onClose,
      t,
    } = this.props;
    const {
      formData,
      formValidity,
      validationMessage,
    } = this.state;

    return (
      <Modal
        actions={[
          {
            color: 'danger',
            feedbackIcon: isPosting && <LoadingIcon />,
            label: t('user:action.terminateContract'),
            onClick: this.onTerminate,
            type: 'submit',
          },
        ]}
        onClose={onClose}
        title={t('user:text.terminateContract')}
      >
        {validationMessage && (
          <div className="mb-5">
            <Alert
              color="danger"
              icon={<Icon icon="error" />}
            >
              <strong>
                {t('general:text.error')}
                {': '}
              </strong>
              {validationMessage}
            </Alert>
          </div>
        )}
        <Grid
          columns="1fr"
          justifyContent="center"
          justifyItems="center"
        >
          <FormLayout>
            <TextField
              id="dateTime"
              label={t('user:element.dateTime')}
              onChange={(e) => this.onChange('dateTime', e.target.value)}
              validationState={formValidity.elements.dateTime ? 'invalid' : null}
              validationText={formValidity.elements.dateTime}
              value={formData.dateTime || ''}
            />
          </FormLayout>
        </Grid>
      </Modal>
    );
  }
}

TerminateContractModalComponent.propTypes = {
  contract: PropTypes.shape().isRequired,
  isPosting: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onTerminate: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  workMonths: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

export default withTranslation()(TerminateContractModalComponent);
