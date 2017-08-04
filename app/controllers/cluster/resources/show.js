import TabController from '../../tab-controller';

export default TabController.extend({
  queryParams: ['filterString'],
  filterString: '',
  activeTab: 'status',
});
