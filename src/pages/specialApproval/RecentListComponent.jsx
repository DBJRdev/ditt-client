import { Link } from 'react-router-dom';
import React from 'react';
import Layout from '../../components/Layout';
import SpecialApprovalList from '../../components/SpecialApprovalList';
import routes from '../../routes';
import styles from './specialApproval.scss';

const ListComponent = props => (
  <Layout title="Recent special approvals">
    <div className={styles.infoText}>
      Recent special approvals page shows you a list of all work logs for current and previous
      month. If you want to see a list of work logs that are requested to be approved or rejected
      by a supervisor, go to the&nbsp;
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link to={routes.specialApprovalList}>
        special approvals
      </Link>
      &nbsp;page.
    </div>
    <SpecialApprovalList {...props} />
  </Layout>
);

ListComponent.defaultProps = SpecialApprovalList.defaultProps;
ListComponent.propTypes = SpecialApprovalList.propTypes;

export default ListComponent;
