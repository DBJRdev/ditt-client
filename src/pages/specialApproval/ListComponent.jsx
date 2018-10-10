import { Link } from 'react-router-dom';
import React from 'react';
import { withNamespaces } from 'react-i18next';
import Layout from '../../components/Layout';
import SpecialApprovalList from '../../components/SpecialApprovalList';
import routes from '../../routes';
import styles from './specialApproval.scss';

const ListComponent = props => (
  <Layout title={props.t('specialApproval:title.specialApprovals')}>
    <p className={styles.infoText}>
      {props.t('specialApproval:text.specialApprovalsBeginningPart')}
      &nbsp;
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link to={routes.recentSpecialApprovalList}>
        {props.t('specialApproval:text.specialApprovalsButtonPart')}
      </Link>
      &nbsp;
      {props.t('specialApproval:text.specialApprovalsClosingPart')}
    </p>
    <SpecialApprovalList {...props} />
  </Layout>
);

ListComponent.defaultProps = SpecialApprovalList.defaultProps;
ListComponent.propTypes = SpecialApprovalList.propTypes;

export default withNamespaces()(ListComponent);
