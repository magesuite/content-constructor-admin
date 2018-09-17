<?php

namespace MageSuite\ContentConstructorAdmin\DataProviders;

class ContentConstructorConfigDataProvider
{
    const XML_PATH_THEME_ID = 'design/theme/theme_id';
    const CREATIVESHOP_THEME_NAME = 'theme-creativeshop';

    /**
     * @var \Magento\Framework\App\Config\ScopeConfigInterface
     */
    protected $scopeConfig;

    /**
     * @var \Magento\Framework\View\Design\Theme\ThemeProviderInterface
     */
    protected $themeProvider;

    /**
     * @var \Magento\Framework\View\Design\Theme\Customization\Path
     */
    protected $customization;

    public function __construct(
        \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig,
        \Magento\Framework\View\Design\Theme\ThemeProviderInterface $themeProvider,
        \Magento\Framework\View\Design\Theme\Customization\Path $customization
    )
    {
        $this->scopeConfig = $scopeConfig;
        $this->themeProvider = $themeProvider;
        $this->customization = $customization;
    }

    public function getCreativeshopConfig() {
        $themesDirectories = $this->getAllThemesDirectories();

        foreach($themesDirectories as $themeDirectory) {
            if($this->isThemeCreativeshop($themeDirectory)) {
                $configContents = $this->getConfigContents($themeDirectory);

                if($configContents == null) {
                    return '{}';
                }

                return $configContents;
            }
        }

    }

    public function getProjectConfig() {
        $themesDirectories = $this->getAllThemesDirectories();

        foreach($themesDirectories as $themeDirectory) {
            if(!$this->isThemeCreativeshop($themeDirectory)) {
                $configContents = $this->getConfigContents($themeDirectory);

                if($configContents == null) {
                    return '{}';
                }

                return $configContents;
            }
        }
    }

    public function getConfig() {
        $themesDirectories = $this->getAllThemesDirectories();

        foreach($themesDirectories as $themeDirectory) {
            $configContents = $this->getConfigContents($themeDirectory);

            if($configContents == null) {
                continue;
            }

            return $configContents;
        }

        return '{}';
    }

    /**
     * @param \Magento\Framework\View\Design\ThemeInterface $theme
     * @return array
     */
    public function getThemesDirectories(\Magento\Framework\View\Design\ThemeInterface $theme) {
        $directories = [];

        $directories[] = $this->customization->getThemeFilesPath($theme);

        if($theme->getParentTheme()) {
            $directories = array_merge(
                $directories,
                $this->getThemesDirectories($theme->getParentTheme())
            );
        }

        return $directories;
    }

    /**
     * @return array
     */
    protected function getAllThemesDirectories()
    {
        $mainThemeId = $this->scopeConfig->getValue(self::XML_PATH_THEME_ID);
        $mainTheme = $this->themeProvider->getThemeById($mainThemeId);

        return $this->getThemesDirectories($mainTheme);
    }

    protected function getConfigContents($themeDirectory) {
        $configFilePath = $themeDirectory . '/configs/cc-config.json';

        if(!file_exists($configFilePath)) {
            return null;
        }

        return file_get_contents($configFilePath);
    }

    protected function isThemeCreativeshop($themeDirectory)
    {
        return strpos($themeDirectory, self::CREATIVESHOP_THEME_NAME) != false;
    }
}