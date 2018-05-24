import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import {
  Modal,
  TextField,
} from 'react-ui';
import {
  ADD_WORK_LOG_FAILURE,
  ADD_WORK_LOG_SUCCESS,
} from '../../resources/workLog/actionTypes';
import { toDayMonthYearFormat } from '../../services/dateTimeService';
import { validateWorkLog } from '../../services/validatorService';

class WorkLogForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      formData: {
        endHour: props.date.hour(),
        endMinute: props.date.minute(),
        startHour: props.date.hour(),
        startMinute: props.date.minute(),
      },
      formValidity: {
        elements: {
          endHour: null,
          endMinute: null,
          form: null,
          startHour: null,
          startMinute: null,
        },
        isValid: false,
      },
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.saveHandler = this.saveHandler.bind(this);

    this.formErrorStyle = {
      color: '#a32100',
      textAlign: 'center',
    };

    this.fieldSetStyle = {
      borderStyle: 'none',
      marginLeft: 'auto',
      marginRight: 'auto',
      maxWidth: '17em',
      padding: '0',
    };

    this.fieldStyle = {
      display: 'inline-block',
    };
  }

  changeHandler(e) {
    const eventTarget = e.target;

    this.setState((prevState) => {
      const formData = Object.assign({}, prevState.formData);
      formData[eventTarget.id] = eventTarget.value;

      return { formData };
    });
  }

  saveHandler() {
    const { date } = this.props;
    const { formData } = this.state;
    const formValidity = validateWorkLog(formData, this.props.workLogsOfDay.toJS());

    this.setState({ formValidity });

    if (formValidity.isValid) {
      this.props.saveHandler({
        endTime: date.clone().hour(formData.endHour).minute(formData.endMinute).second(0),
        startTime: date.clone().hour(formData.startHour).minute(formData.startMinute).second(0),
      })
        .then((response) => {
          if (response.type === ADD_WORK_LOG_SUCCESS) {
            this.props.closeHandler();
          } else if (response.type === ADD_WORK_LOG_FAILURE) {
            formValidity.elements.form = 'Work log cannot be added.';

            this.setState({ formValidity });
          }
        });
    }
  }

  render() {
    return (
      <Modal
        actions={[
          {
            clickHandler: this.saveHandler,
            label: 'Save',
            loading: this.props.isPosting,
          },
        ]}
        closeHandler={this.props.closeHandler}
        title="Add work log"
      >
        <p style={this.formErrorStyle}>
          {this.state.formValidity.elements.form}
        </p>
        <form>
          <fieldset style={this.fieldSetStyle}>
            <legend>Date</legend>
            <div style={this.fieldStyle}>
              <TextField
                disabled
                fieldId="date"
                isLabelVisible={false}
                label="Date"
                value={toDayMonthYearFormat(this.props.date) || ''}
              />
            </div>
          </fieldset>
          <fieldset style={this.fieldSetStyle}>
            <legend>Start time:</legend>
            <div>
              <div style={this.fieldStyle}>
                <TextField
                  autoFocus
                  changeHandler={this.changeHandler}
                  error={this.state.formValidity.elements.startHour}
                  fieldId="startHour"
                  isLabelVisible={false}
                  label="Start hour"
                  value={this.state.formData.startHour || ''}
                />
              </div>
              :
              <div style={this.fieldStyle}>
                <TextField
                  changeHandler={this.changeHandler}
                  error={this.state.formValidity.elements.startMinute}
                  fieldId="startMinute"
                  isLabelVisible={false}
                  label="Start minute"
                  value={this.state.formData.startMinute || ''}
                />
              </div>
              &nbsp;h
            </div>
          </fieldset>
          <fieldset style={this.fieldSetStyle}>
            <legend>End time:</legend>
            <div>
              <div style={this.fieldStyle}>
                <TextField
                  changeHandler={this.changeHandler}
                  error={this.state.formValidity.elements.endHour}
                  fieldId="endHour"
                  isLabelVisible={false}
                  label="End hour"
                  value={this.state.formData.endHour || ''}
                />
              </div>
              :
              <div style={this.fieldStyle}>
                <TextField
                  changeHandler={this.changeHandler}
                  error={this.state.formValidity.elements.endMinute}
                  fieldId="endMinute"
                  isLabelVisible={false}
                  label="End minute"
                  value={this.state.formData.endMinute || ''}
                />
              </div>
              &nbsp;h
            </div>
          </fieldset>
        </form>
      </Modal>
    );
  }
}

WorkLogForm.propTypes = {
  closeHandler: PropTypes.func.isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
  isPosting: PropTypes.bool.isRequired,
  saveHandler: PropTypes.func.isRequired,
  workLogsOfDay: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
    endTime: PropTypes.shape.isRequired,
    id: PropTypes.number.isRequired,
    startTime: PropTypes.shape.isRequired,
  })).isRequired,
};

export default WorkLogForm;
