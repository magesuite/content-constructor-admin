<?php

namespace MageSuite\ContentConstructorAdmin\Helper;

class Configuration
{
    const SECRET_TOKEN_ADMIN_CONTENT_CONSTRUCTOR_PREVIEW_PATH = 'magesuite/content_constructor_admin/preview_secret';

    const CUSTOM_ADMIN_PATH = 'admin/url/custom_path';

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @var \Magento\Framework\App\DeploymentConfig\Reader
     */
    protected $configReader;

    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeInterface,
        \Magento\Framework\App\DeploymentConfig\Reader $configReader
    ) {
        $this->scopeConfig = $scopeInterface;
        $this->configReader = $configReader;
    }

    public function getAdminPrefix()
    {
        $adminPath = $this->scopeConfig->getValue(self::CUSTOM_ADMIN_PATH);
        if (!$adminPath) {
            $config = $this->configReader->load();
            $adminPath = $config['backend']['frontName'];
        }

        return $adminPath;
    }

    public function getSecretPreviewToken()
    {
        return $this->scopeConfig->getValue(self::SECRET_TOKEN_ADMIN_CONTENT_CONSTRUCTOR_PREVIEW_PATH);
    }
}
