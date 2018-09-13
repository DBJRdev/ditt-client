import React from 'react';
import Layout from '../../components/Layout';
import SpecialApprovalList from '../../components/SpecialApprovalList';

const ListComponent = props => (
  <Layout title="Special approvals">
    <SpecialApprovalList {...props} />
  </Layout>
);

ListComponent.defaultProps = SpecialApprovalList.defaultProps;
ListComponent.propTypes = SpecialApprovalList.propTypes;

export default ListComponent;
