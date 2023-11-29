<?php

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor;

use Magento\Ui\Component\Form\Element\DataType\Media\OpenDialogUrl;
use Magento\Cms\Model\Wysiwyg\Config;

class Constructor extends \Magento\Framework\View\Element\Template
{
    /**
     * @var \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper
     */
    protected $xmlToComponentConfiguration;

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
     * @var ConfigurationProvider
     */
    protected $configurationProvider;

    /**
     * @var \Magento\Store\Model\StoreManagerInterface
     */
    protected $storeManager;

    /**
	 * @var \MageSuite\ContentConstructorAdmin\Helper\Configuration
	 */
     protected $configurationHelper;

    /**
     * @var \Magento\Cms\Helper\Wysiwyg\Images
     */
    protected $imagesHelper;

    /**
     * @var OpednDialogUrl
     */
    protected $openDialogUrl;

    /**
     * Constructor constructor.
     * @param \Magento\Framework\View\Element\Template\Context $context
     * @param \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfiguration
     * @param \Magento\Framework\Registry $registry
     * @param \Magento\Store\Model\StoreManagerInterface $storeManager
     * @param \MageSuite\ContentConstructorAdmin\Helper\Configuration $configurationHelper
     * @param OpenDialogUrl $openDialogUrl
     * @param array $data
     */
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        \MageSuite\ContentConstructorAdmin\Repository\Xml\XmlToComponentConfigurationMapper $xmlToComponentConfiguration,
        \Magento\Framework\Registry $registry,
        \MageSuite\ContentConstructorAsset\Service\AssetLocator $assetLocator,
        \Magento\Backend\Model\UrlInterface $backendUrl,
        \MageSuite\ContentConstructorAdmin\DataProviders\ContentConstructorConfigDataProvider $contentConstructorConfigDataProvider,
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \MageSuite\ContentConstructorAdmin\Helper\ConfigurationMediaResolver $configurationMediaResolver,
        \MageSuite\ContentConstructorFrontend\Model\Sort\Pool $sortersPool,
        \MageSuite\ContentConstructorFrontend\Model\Filter\Pool $filtersPool,
        \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider $configurationProvider,
        \Magento\Store\Model\StoreManagerInterface $storeManager,
        \MageSuite\ContentConstructorAdmin\Helper\Configuration $configurationHelper,
        \Magento\Cms\Helper\Wysiwyg\Images $imagesHelper,
        OpenDialogUrl $openDialogUrl,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->xmlToComponentConfiguration = $xmlToComponentConfiguration;
        $this->registry = $registry;
        $this->assetLocator = $assetLocator;
        $this->backendUrl = $backendUrl;
        $this->contentConstructorConfigDataProvider = $contentConstructorConfigDataProvider;
        $this->scopeConfig = $scopeConfig;
        $this->configurationMediaResolver = $configurationMediaResolver;
        $this->sortersPool = $sortersPool;
        $this->filtersPool = $filtersPool;
        $this->configurationProvider = $configurationProvider;
        $this->storeManager = $storeManager;
        $this->configurationHelper = $configurationHelper;
        $this->imagesHelper = $imagesHelper;
        $this->openDialogUrl = $openDialogUrl;

        $this->setTemplate('MageSuite_ContentConstructorAdmin::constructor.phtml');
    }

    public function getConfiguratorEndpointUrl()
    {
        return $this->getUrl('contentconstructor/component/configurator') . 'type/{/component_type}';
    }

    public function getRestTokenEndpoint()
    {
        return $this->getUrl('contentconstructor/token/generator');
    }

    public function getPreviewTokenUrl()
    {
        return $this->getUrl('contentconstructor/token/previewsecret');
    }

    public function getImageEndpoint()
    {
        return $this->getUrl('contentconstructor/image/show') . 'image/{/encoded_image}';
    }

    public function getCategoryDataProviderEndpoint()
    {
        return $this->getUrl('contentconstructor/category/provider');
    }

    public function getAsset($assetLocation)
    {
        return $this->assetLocator->getUrl($assetLocation);
    }

    public function getUploaderUrl()
    {
        return $this->backendUrl->getUrl(
            $this->openDialogUrl->get(), [
                'current_tree_path' => $this->imagesHelper->idEncode(
                    Config::IMAGE_DIRECTORY // => 'wysiwyg'
                )
            ]
        );
    }

    public function getContentConstructorConfig()
    {
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

    public function resolveConfigurationMedia($configuration)
    {
        $configuration = json_decode($configuration, true);

        $configuration = $this->configurationMediaResolver->resolveMedia($configuration);

        return json_encode($configuration);
    }

    public function getAdminPrefix()
    {
        return $this->configurationHelper->getAdminPath();
    }

    public function getSorters()
    {
        $sorters = $this->sortersPool->getSorters();

        if (empty($sorters)) {
            return [];
        }

        $result = [];

        foreach ($sorters as $sorter) {
            $result[] = [
                'label' => $sorter['label'],
                'value' => $sorter['value'],
            ];
        }

        return json_encode($result);
    }

    public function getFilters()
    {
        $filters = $this->filtersPool->getFilters();

        if (empty($filters)) {
            return [];
        }

        $result = [];

        foreach ($filters as $filter) {
            $result[] = [
                'label' => $filter['label'],
                'value' => $filter['value'],
            ];
        }

        return json_encode($result);
    }

    public function getExistingComponentsConfiguration()
    {
        return $this->configurationProvider->getExistingComponentsConfiguration();
    }

    public function getPageType()
    {
        return $this->configurationProvider->getPageType();
    }

    public function getBaseUrl()
    {
        return $this->storeManager->getStore()->getBaseUrl();
    }

    public function getSecretPreviewToken()
    {
        return $this->configurationHelper->getSecretPreviewToken();
    }

    public function getProductDataEndpoint()
    {
        return str_replace('admin/', '', $this->getBaseUrl()) . 'content-constructor/component/productteaserdata';
    }
}
