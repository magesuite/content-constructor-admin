<?php

namespace MageSuite\ContentConstructorAdmin\Service;

class PreviewSecretProvider
{
    const SECRET_PREVIEW_TOKEN_FORMAT = '%s%s';

    /**
     * @var \MageSuite\ContentConstructorAdmin\Helper\Configuration
     */
    protected $configurationHelper;

    public function __construct(\MageSuite\ContentConstructorAdmin\Helper\Configuration $configurationHelper)
    {
        $this->configurationHelper = $configurationHelper;
    }

    public function execute($requestConfiguration)
    {
        $secretPreviewToken = sprintf(
            self::SECRET_PREVIEW_TOKEN_FORMAT,
            $this->configurationHelper->getSecretPreviewToken(),
            $requestConfiguration
        );
        return hash("sha256", $secretPreviewToken);
    }
}
