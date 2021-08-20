module.exports = {
  skipFiles: ['Migrations.sol', 'Stakable.sol', 'bondingcurve/BancorFormula.sol', 'bondingcurve/IBancorFormula.sol'],
  istanbulFolder:	'./docs/report/coverage',
  istanbulReporter:	['html']
};
