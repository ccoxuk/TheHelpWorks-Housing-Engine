# Contributing to TheHelpWorks Housing Engine

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Prioritize user privacy and security
- Maintain professionalism

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/TheHelpWorks-Housing-Engine.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Set up your development environment (see QUICKSTART.md)

## Development Workflow

### 1. Make Your Changes

- Follow existing code style
- Write clear, descriptive commit messages
- Keep changes focused and atomic

### 2. Test Your Changes

**Backend:**
```bash
cd backend
pytest app/tests/ -v
flake8 app
black app --check
```

**Frontend:**
```bash
cd frontend
npm test
npm run lint
```

### 3. Commit Your Changes

```bash
git add .
git commit -m "Clear description of changes"
```

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or changes
- `chore:` Build/tooling changes

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Code Standards

### Python (Backend)

- Follow PEP 8 style guide
- Use type hints where appropriate
- Write docstrings for functions and classes
- Maximum line length: 100 characters
- Use Black for formatting
- Use Flake8 for linting

Example:
```python
def process_data(input_data: Dict[str, Any]) -> List[str]:
    """
    Process input data and return results.
    
    Args:
        input_data: Dictionary containing input parameters
        
    Returns:
        List of processed results
    """
    # Implementation here
    pass
```

### JavaScript/React Native (Frontend)

- Use ES6+ features
- Use functional components with hooks
- Follow Airbnb JavaScript style guide
- Use meaningful variable and function names
- Write JSDoc comments for complex functions

Example:
```javascript
/**
 * Process user input and return formatted data
 * @param {Object} input - User input data
 * @returns {Array} Formatted results
 */
const processUserInput = (input) => {
  // Implementation here
};
```

## Testing Guidelines

### Backend Tests

- Write tests for all new features
- Maintain or improve code coverage
- Use pytest fixtures for common setup
- Test both success and error cases

Example:
```python
def test_chat_endpoint():
    """Test chat endpoint with valid input"""
    payload = {"messages": [{"role": "user", "content": "test"}]}
    response = client.post("/api/v1/chat/", json=payload)
    assert response.status_code == 200
    assert "message" in response.json()
```

### Frontend Tests

- Test component rendering
- Test user interactions
- Test API integration
- Use React Testing Library

## Documentation

- Update README.md for major changes
- Update API.md for API changes
- Add inline comments for complex logic
- Update ARCHITECTURE.md for structural changes

## Pull Request Process

1. **Description**: Provide clear description of changes
2. **Testing**: Confirm all tests pass
3. **Documentation**: Update relevant documentation
4. **Review**: Address feedback from maintainers
5. **Merge**: Maintainers will merge approved PRs

### PR Checklist

- [ ] Tests added/updated and passing
- [ ] Code follows project style guidelines
- [ ] Documentation updated
- [ ] No security vulnerabilities introduced
- [ ] Commit messages are clear
- [ ] Branch is up to date with main

## Areas for Contribution

### High Priority

- Real OpenAI API integration
- User authentication system
- PostgreSQL database migration
- Additional legal templates
- Enhanced ETL pipeline
- Mobile app testing

### Medium Priority

- Improved error handling
- Performance optimization
- Additional decision pathways
- Multi-language support
- Accessibility improvements

### Nice to Have

- Admin dashboard
- Analytics integration
- Email notifications
- PDF generation for templates
- Offline mode for mobile

## Questions or Issues?

- Check existing issues on GitHub
- Create a new issue with:
  - Clear title
  - Detailed description
  - Steps to reproduce (for bugs)
  - Expected vs actual behavior
  - Screenshots if applicable

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (see LICENSE file).

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to TheHelpWorks Housing Engine! 🎉
