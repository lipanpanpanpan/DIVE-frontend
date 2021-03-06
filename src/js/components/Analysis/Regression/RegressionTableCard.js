import React, { Component, PropTypes } from 'react';

import styles from '../Analysis.sass';

import Card from '../../Base/Card';
import ColoredFieldItems from '../../Base/ColoredFieldItems';
import RegressionTable from './RegressionTable';


export default class RegressionTableCard extends Component {
  render() {
    const { regressionType, dependentVariableName, independentVariableNames, regressionResult, contributionToRSquared } = this.props;

    let tableCardHeader;
    if (dependentVariableName) {
      tableCardHeader = <span>Explaining <ColoredFieldItems fields={[ dependentVariableName ]} /> in terms of <ColoredFieldItems fields={ independentVariableNames } /></span>
    }
    return (
      <Card
        header={ tableCardHeader }
        helperText='regression'
      >
        <RegressionTable regressionType={ regressionType } regressionResult={ regressionResult }/>
      </Card>
    );
  }
}

RegressionTableCard.propTypes = {
  dependentVariableName: PropTypes.string,
  independentVariableNames: PropTypes.array.isRequired,
  regressionResult: PropTypes.object,
  contributionToRSquared: PropTypes.array
}
