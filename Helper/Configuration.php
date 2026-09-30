<?php

declare(strict_types=1);

namespace MageSuite\ContentConstructorAdmin\Helper;

class Configuration
{
    public const string SECRET_TOKEN_ADMIN_CONTENT_CONSTRUCTOR_PREVIEW_PATH = 'magesuite/content_constructor_admin/preview_secret';
    public const string CUSTOM_ADMIN_PATH = 'admin/url/custom_path';
    public const string PRODUCTS_PER_PAGE_PATH = 'catalog/frontend/grid_per_page';

    public function __construct(
        protected \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        protected \Magento\Framework\App\DeploymentConfig\Reader $configReader
    ) {
    }

    public function getAdminPath(): string
    {
        $adminPath = (string) $this->scopeConfig->getValue(self::CUSTOM_ADMIN_PATH);

        if ($adminPath !== '') {
            return $adminPath;
        }

        return (string) ($this->configReader->load()['backend']['frontName'] ?? '');
    }

    public function getSecretPreviewToken(): string
    {
        return (string) $this->scopeConfig->getValue(self::SECRET_TOKEN_ADMIN_CONTENT_CONSTRUCTOR_PREVIEW_PATH);
    }

    public function getProductsPerPage(): string
    {
        return (string) $this->scopeConfig->getValue(
            self::PRODUCTS_PER_PAGE_PATH,
            \Magento\Store\Model\ScopeInterface::SCOPE_STORE
        );
    }
}
