<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor;

abstract class AbstractConstructor extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper
     */
    protected $xmlToComponentConfiguration;

    /**
     * @var \Magento\Framework\App\DeploymentConfig\Reader
     */
    protected $configReader;

    /**
     * @var \Magento\Framework\Registry
     */
    protected $registry;
    /**
     * @var \MageSuite\ContentConstructorAsset\Service\AssetLocator
     */
    protected $assetLocator;
    /**
     * @var \Magento\Backend\Model\UrlInterface
     */
    protected $backendUrl;
    /**
     * @var \MageSuite\ContentConstructorAdmin\Service\UiComponentRenderer
     */
    protected $uiComponentRenderer;
    /**
     * @var \MageSuite\ContentConstructorAdmin\DataProviders\ContentConstructorConfigDataProvider
     */
    protected $contentConstructorConfigDataProvider;

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @var \MageSuite\ContentConstructorAdmin\Helper\ConfigurationMediaResolver
     */
    protected $configurationMediaResolver;

    /**
     * @var \MageSuite\ContentConstructorFrontend\Model\Sort\Pool
     */
    protected $sortersPool;

    /**
     * @var \MageSuite\ContentConstructorFrontend\Model\Filter\Pool
     */
    protected $filtersPool;

    /**
     * Constructor constructor.
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfiguration
     * @param \Magento\Framework\App\DeploymentConfig\Reader $configReader
     * @param \Magento\Framework\Registry $registry
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfiguration,
        \Magento\Framework\App\DeploymentConfig\Reader $configReader,
        \Magento\Framework\Registry $registry,
        \MageSuite\ContentConstructorAsset\Service\AssetLocator $assetLocator,
        \Magento\Backend\Model\UrlInterface $backendUrl,
        \MageSuite\ContentConstructorAdmin\DataProviders\ContentConstructorConfigDataProvider $contentConstructorConfigDataProvider,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \MageSuite\ContentConstructorAdmin\Helper\ConfigurationMediaResolver $configurationMediaResolver,
        \MageSuite\ContentConstructorFrontend\Model\Sort\Pool $sortersPool,
        \MageSuite\ContentConstructorFrontend\Model\Filter\Pool $filtersPool,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->xmlToComponentConfiguration = $xmlToComponentConfiguration;
        $this->configReader = $configReader;
        $this->registry = $registry;
        $this->assetLocator = $assetLocator;
        $this->backendUrl = $backendUrl;
        $this->contentConstructorConfigDataProvider = $contentConstructorConfigDataProvider;
        $this->scopeConfig = $scopeConfig;
        $this->configurationMediaResolver = $configurationMediaResolver;
        $this->sortersPool = $sortersPool;
        $this->filtersPool = $filtersPool;

        $this->setTemplate('constructor.phtml');
    }

    public function getConfiguratorEndpointUrl()
    {
        return $this->getAdminUrl('content-constructor/component/configurator/type/{/component_type}');
    }

    public function getRestTokenEndpoint()
    {
        return $this->getAdminUrl('content-constructor/token/generator');
    }

    public function getImageEndpoint()
    {
        return $this->getAdminUrl('content-constructor/image/show/image/{/encoded_image}');
    }

    public function getCategoryDataProviderEndpoint() {
        return $this->getAdminUrl('content-constructor/category/provider');
    }

    public function getAsset($assetLocation)
    {
        return $this->assetLocator->getUrl($assetLocation);
    }

    public function getUploaderUrl()
    {
        return $this->backendUrl->getUrl('cms/wysiwyg_images/index');
    }

    public function getContentConstructorConfig() {
        $config = $this->contentConstructorConfigDataProvider->getConfig();

        return $config;
    }

    public function getProductsPerPage()
    {
        return $this->scopeConfig->getValue(
            'catalog/frontend/grid_per_page',
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }

    protected function getAdminUrl($suffix)
    {
        $adminPrefix = $this->getAdminPrefix();

        return '/' . $adminPrefix . '/' . $suffix;
    }

    public function resolveConfigurationMedia($configuration) {
        $configuration = json_decode($configuration, true);

        $configuration = $this->configurationMediaResolver->resolveMedia($configuration);

        return json_encode($configuration);
    }

    public function getAdminPrefix()
    {
        $config = $this->configReader->load();

        return $config['backend']['frontName'];
    }

    public function getSorters() {
        $sorters = $this->sortersPool->getSorters();

        if(empty($sorters)) {
            return [];
        }

        $result = [];

        foreach($sorters as $sorter) {
            $result[] = [
                'label' => $sorter['label'],
                'value' => $sorter['value'],
            ];
        }

        return json_encode($result);
    }

    public function getFilters() {
        $filters = $this->filtersPool->getFilters();

        if(empty($filters)) {
            return [];
        }

        $result = [];

        foreach($filters as $filter) {
            $result[] = [
                'label' => $filter['label'],
                'value' => $filter['value'],
            ];
        }

        return json_encode($result);
    }

    public abstract function getExistingComponentsConfiguration();

    public abstract function getPageType();
}
