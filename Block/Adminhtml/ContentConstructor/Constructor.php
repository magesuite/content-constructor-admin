<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor;

class Constructor extends \Magento\Framework\View\Element\Template
{
    public function __construct(
        \Magento\Framework\View\Element\Template\Context $context,
        protected \MageSuite\ContentConstructorAsset\Service\AssetLocator $assetLocator,
        protected \MageSuite\ContentConstructorAdmin\DataProviders\ContentConstructorConfigDataProvider $contentConstructorConfigDataProvider,
        protected \MageSuite\ContentConstructorAdmin\Helper\ConfigurationMediaResolver $configurationMediaResolver,
        protected \MageSuite\ContentConstructorAdmin\Model\Editor\ProductCollectionOptions $productCollectionOptions,
        protected \MageSuite\ContentConstructorAdmin\Model\Editor\MediaUploaderUrlProvider $mediaUploaderUrlProvider,
        protected \MageSuite\ContentConstructorAdmin\Block\Adminhtml\ContentConstructor\ConfigurationProvider $configurationProvider,
        protected \MageSuite\ContentConstructorAdmin\Helper\Configuration $configurationHelper,
        array $data = []
    ) {
        parent::__construct($context, $data);

        $this->setTemplate('MageSuite_ContentConstructorAdmin::constructor.phtml');
    }

    public function getConfiguratorEndpointUrl(): string
    {
        return sprintf('%stype/{/component_type}', $this->getUrl('contentconstructor/component/configurator'));
    }

    public function getRestTokenEndpoint(): string
    {
        return $this->getUrl('contentconstructor/token/generator');
    }

    public function getPreviewTokenUrl(): string
    {
        return $this->getUrl('contentconstructor/token/previewsecret');
    }

    public function getImageEndpoint(): string
    {
        return sprintf('%simage/{/encoded_image}', $this->getUrl('contentconstructor/image/show'));
    }

    public function getCategoryDataProviderEndpoint(): string
    {
        return $this->getUrl('contentconstructor/category/provider');
    }

    public function getAsset(string $assetLocation): string
    {
        return (string) $this->assetLocator->getUrl($assetLocation);
    }

    public function getUploaderUrl(): string
    {
        return $this->mediaUploaderUrlProvider->getUrl();
    }

    public function getContentConstructorConfig(): string
    {
        return (string) $this->contentConstructorConfigDataProvider->getConfig();
    }

    public function getProductsPerPage(): string
    {
        return $this->configurationHelper->getProductsPerPage();
    }

    public function resolveConfigurationMedia(mixed $configuration): string
    {
        $resolvedConfiguration = $this->configurationMediaResolver->resolveMedia(json_decode((string) $configuration, true));

        return (string) json_encode($resolvedConfiguration);
    }

    public function getAdminPrefix(): string
    {
        return (string) $this->configurationHelper->getAdminPath();
    }

    public function getSorters(): string
    {
        return $this->productCollectionOptions->getSortersJson();
    }

    public function getFilters(): string
    {
        return $this->productCollectionOptions->getFiltersJson();
    }

    public function getExistingComponentsConfiguration(): mixed
    {
        return $this->configurationProvider->getExistingComponentsConfiguration();
    }

    public function getPageType(): mixed
    {
        return $this->configurationProvider->getPageType();
    }

    public function getBaseUrl(): string
    {
        return (string) $this->_storeManager->getStore()->getBaseUrl();
    }

    public function getSecretPreviewToken(): string
    {
        return (string) $this->configurationHelper->getSecretPreviewToken();
    }

    public function getProductDataEndpoint(): string
    {
        return $this->getUrl('contentconstructor/component/productTeaserData');
    }

    public function getProductChooserUrl(): string
    {
        return $this->getUrl('contentconstructor/component/productChooser');
    }
}
