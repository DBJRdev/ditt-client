import { Link } from 'react-router-dom';
import React from 'react';
import { withTranslation } from 'react-i18next';
import Layout from '../../components/Layout';
import SpecialApprovalList from '../../components/SpecialApprovalList';
import routes from '../../routes';
import styles from './specialApproval.scss';

const ListComponent = (props) => (
  <Layout title={props.t('specialApproval:title.recentSpecialApprovals')}>
    <div className={styles.infoText}>
      {props.t('specialApproval:text.recentSpecialApprovalsBeginningPart')}
      &nbsp;
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link to={routes.specialApprovalList}>
        {props.t('specialApproval:text.recentSpecialApprovals')}
      </Link>
      &nbsp;
      {props.t('specialApproval:text.recentSpecialApprovalsClosingPart')}
    </div>
    <SpecialApprovalList {...props} />
  </Layout>
);

ListComponent.defaultProps = SpecialApprovalList.defaultProps;
ListComponent.propTypes = SpecialApprovalList.propTypes;

export default withTranslation()(ListComponent);
