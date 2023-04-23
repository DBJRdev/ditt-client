import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import {
  CheckboxField,
  FormLayout,
  Grid,
  Modal,
  Radio,
  TextField,
} from '@react-ui-org/react-ui';
import { validateContract } from '../../../../services/validatorService';
import {
  getWorkHoursString,
  getWorkHoursValue,
} from '../../../../services/workHoursService';
import { getInitialState } from '../_helpers/getInitialState';
import { getStateToSave } from '../_helpers/getStateToSave';
import {
  localizedMoment,
  toDayMonthYearFormat,
} from '../../../../services/dateTimeService';

class ContractModalComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialStateInternal(props.data);

    this.onChange = this.onChange.bind(this);
    this.onSave = this.onSave.bind(this);
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState(this.getInitialStateInternal(data));
  }

  onChange(id, value) {
    this.setState((prevState) => {
      const { formData } = prevState;

      if (id === 'isDayBased') {
        const weeklyWorkingDays = Object.keys(formData).filter((key) => key.includes('Included') && formData[key]).length;

        return ({
          formData: {
            ...prevState.formData,
            [id]: value,
            weeklyWorkingDays: value ? weeklyWorkingDays : formData.weeklyWorkingDays,
          },
        });
      }

      if (id.includes('Included')) {
        const weeklyWorkingDays = Object
          .keys(formData)
          .filter((key) => key.includes('Included') && formData[key])
          .length;

        return ({
          formData: {
            ...prevState.formData,
            [id]: value,
            weeklyWorkingDays: weeklyWorkingDays + (value ? 1 : -1),
          },
        });
      }

      return ({
        formData: {
          ...prevState.formData,
          [id]: value,
        },
      });
    });
  }

  onSave() {
    const {
      onSave,
      t,
    } = this.props;
    const { formData } = this.state;

    const formValidity = validateContract(t, formData);

    this.setState({ formValidity });

    if (formValidity.isValid) {
      onSave(getStateToSave(formData));
    }
  }

  getInitialStateInternal(data) {
    const { contracts } = this.props;
    const initialState = getInitialState(data);

    if (data != null) {
      return initialState;
    }

    const filteredContracts = [...contracts];
    filteredContracts.sort((a, b) => b.startDateTime.unix() - a.startDateTime.unix());

    if (filteredContracts.length > 0 && filteredContracts[0].endDateTime != null) {
      initialState.formData.startDateTime = toDayMonthYearFormat(filteredContracts[0].endDateTime.clone().add(1, 'day').startOf('day'));
    } else {
      initialState.formData.startDateTime = toDayMonthYearFormat(localizedMoment().startOf('day'));
    }

    return initialState;
  }

  render() {
    const {
      data,
      onClose,
      t,
    } = this.props;
    const {
      formData,
      formValidity,
    } = this.state;

    let dailyWorkingHours;
    try {
      dailyWorkingHours = getWorkHoursValue(formData.weeklyWorkingHours) / 3600 / formData.weeklyWorkingDays;
    } catch (e) {
      dailyWorkingHours = null;
    }

    return (
      <Modal
        actions={[
          {
            label: t('general:action.save'),
            onClick: this.onSave,
            type: 'submit',
          },
        ]}
        onClose={onClose}
        title={data ? t('user:text.addContract') : t('user:text.editContract')}
      >
        <Grid
          columns="1fr"
          justifyContent="center"
          justifyItems="center"
        >
          <FormLayout>
            <TextField
              id="startDateTime"
              label={t('user:element.startDateTime')}
              onChange={(e) => this.onChange('startDateTime', e.target.value)}
              validationState={formValidity.elements.startDateTime ? 'invalid' : null}
              validationText={formValidity.elements.startDateTime}
              value={formData.startDateTime || ''}
            />
            <TextField
              id="endDateTime"
              label={t('user:element.endDateTime')}
              onChange={(e) => this.onChange('endDateTime', e.target.value)}
              validationState={formValidity.elements.endDateTime ? 'invalid' : null}
              validationText={formValidity.elements.endDateTime}
              value={formData.endDateTime || ''}
            />
            <Radio
              id="isDayBased"
              isLabelVisible={false}
              label={t('user:element.isDayBased')}
              onChange={(e) => this.onChange('isDayBased', e.target.value === 'dayBased')}
              options={[
                {
                  label: t('user:element.dayBased'),
                  value: 'dayBased',
                },
                {
                  label: t('user:element.flexible'),
                  value: 'flexible',
                },
              ]}
              value={formData.isDayBased === false ? 'flexible' : 'dayBased'}
            />
            {formData.isDayBased && (
              <>
                <CheckboxField
                  checked={formData.isMondayIncluded || false}
                  id="isMondayIncluded"
                  label={t('user:element.isMondayIncluded')}
                  onChange={(e) => this.onChange('isMondayIncluded', e.target.checked)}
                  validationState={formValidity.elements.isMondayIncluded ? 'invalid' : null}
                  validationText={formValidity.elements.isMondayIncluded}
                />
                <CheckboxField
                  checked={formData.isTuesdayIncluded || false}
                  id="isTuesdayIncluded"
                  label={t('user:element.isTuesdayIncluded')}
                  onChange={(e) => this.onChange('isTuesdayIncluded', e.target.checked)}
                  validationState={formValidity.elements.isTuesdayIncluded ? 'invalid' : null}
                  validationText={formValidity.elements.isTuesdayIncluded}
                />
                <CheckboxField
                  checked={formData.isWednesdayIncluded || false}
                  id="isWednesdayIncluded"
                  label={t('user:element.isWednesdayIncluded')}
                  onChange={(e) => this.onChange('isWednesdayIncluded', e.target.checked)}
                  validationState={formValidity.elements.isWednesdayIncluded ? 'invalid' : null}
                  validationText={formValidity.elements.isWednesdayIncluded}
                />
                <CheckboxField
                  checked={formData.isThursdayIncluded || false}
                  id="isThursdayIncluded"
                  label={t('user:element.isThursdayIncluded')}
                  onChange={(e) => this.onChange('isThursdayIncluded', e.target.checked)}
                  validationState={formValidity.elements.isThursdayIncluded ? 'invalid' : null}
                  validationText={formValidity.elements.isThursdayIncluded}
                />
                <CheckboxField
                  checked={formData.isFridayIncluded || false}
                  id="isFridayIncluded"
                  label={t('user:element.isFridayIncluded')}
                  onChange={(e) => this.onChange('isFridayIncluded', e.target.checked)}
                  validationState={formValidity.elements.isFridayIncluded ? 'invalid' : null}
                  validationText={formValidity.elements.isFridayIncluded}
                />
              </>
            )}
            {!formData.isDayBased && (
              <TextField
                id="weeklyWorkingDays"
                label={t('user:element.weeklyWorkingDays')}
                onChange={(e) => this.onChange('weeklyWorkingDays', e.target.value)}
                validationState={formValidity.elements.weeklyWorkingDays ? 'invalid' : null}
                validationText={formValidity.elements.weeklyWorkingDays}
                value={formData.weeklyWorkingDays || ''}
              />
            )}
            <TextField
              id="weeklyWorkingHours"
              label={t('user:element.weeklyWorkingHours')}
              onChange={(e) => this.onChange('weeklyWorkingHours', e.target.value)}
              validationState={formValidity.elements.weeklyWorkingHours ? 'invalid' : null}
              validationText={formValidity.elements.weeklyWorkingHours}
              value={formData.weeklyWorkingHours || ''}
            />
            <TextField
              disabled
              id="dailyWorkingHours"
              label={t('user:element.dailyWorkingHours')}
              value={Number.isFinite(dailyWorkingHours) ? getWorkHoursString(dailyWorkingHours * 3600) : '–'}
            />
          </FormLayout>
        </Grid>
      </Modal>
    );
  }
}

ContractModalComponent.defaultProps = {
  data: null,
};

ContractModalComponent.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  data: PropTypes.shape({
    endDateTime: PropTypes.shape(),
    id: PropTypes.number,
    isDayBased: PropTypes.bool.isRequired,
    isFridayIncluded: PropTypes.bool.isRequired,
    isMondayIncluded: PropTypes.bool.isRequired,
    isThursdayIncluded: PropTypes.bool.isRequired,
    isTuesdayIncluded: PropTypes.bool.isRequired,
    isWednesdayIncluded: PropTypes.bool.isRequired,
    startDateTime: PropTypes.shape().isRequired,
    weeklyWorkingDays: PropTypes.number.isRequired,
    weeklyWorkingHours: PropTypes.number.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
};

export default withTranslation()(ContractModalComponent);
